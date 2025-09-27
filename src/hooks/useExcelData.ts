import { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

export interface ExcelData {
  rows: any[][];
  fileName: string;
  searchTerm: string;
  isLoading: boolean;
  headers: any[];
  uniqueValuesByColumn: Record<number, string[]>;
  columnFilters: Record<number, Set<string>>;
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
}

export function useExcelData() {
  const [rows, setRows] = useState<any[][]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<Record<number, Set<string>>>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [originalRows, setOriginalRows] = useState<any[][]>([]);
  const { toast } = useToast();

  const STORAGE_KEY = "excelhub:last_data";

  const persist = (data: { rows: any[][]; fileName: string; fileDataUrl?: string }) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...data, updatedAt: Date.now() })
      );
      // broadcast to other tabs and listeners
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY } as any));
      // dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent("excelhub:data-updated", { 
        detail: { rows: data.rows, fileName: data.fileName, updatedAt: Date.now() }
      }));
    } catch {}
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed as { rows: any[][]; fileName: string; fileDataUrl?: string; updatedAt?: number };
    } catch {
      return null;
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;

    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv', '.xlsm', '.xlsb', '.ods'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with one of these extensions: ${validExtensions.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "File terlalu besar",
        description: `Ukuran file (${(file.size / 1024 / 1024).toFixed(1)}MB) melebihi batas maksimal 50MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size (min 1KB)
    const minSize = 1024; // 1KB
    if (file.size < minSize) {
      toast({
        title: "File terlalu kecil",
        description: "File sepertinya kosong atau rusak",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        
        // Enhanced XLSX reading options for better data handling
        const workbook = XLSX.read(data, { 
          type: "array",
          cellDates: true,        // Parse dates properly
          cellNF: false,          // Don't parse number formats
          cellStyles: false,      // Don't parse styles
          sheetStubs: false,      // Don't create stub sheets
          bookDeps: false,        // Don't parse dependencies
          bookProps: false,       // Don't parse properties
          bookSheets: false,      // Don't parse sheet properties
          bookVBA: false,         // Don't parse VBA
          password: "",           // No password
          WTF: false,             // Don't warn about features
          codepage: 65001         // UTF-8 encoding for better text support
        });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error("No sheets found in the file");
        }

        // Use the first sheet or the sheet with the most data
        let selectedSheet = workbook.SheetNames[0];
        let maxCells = 0;
        
        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1:A1');
          const cellCount = (range.e.r - range.s.r + 1) * (range.e.c - range.s.c + 1);
          if (cellCount > maxCells) {
            maxCells = cellCount;
            selectedSheet = sheetName;
          }
        }

        const worksheet = workbook.Sheets[selectedSheet];
        
        // Enhanced data extraction with better options
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: "",           // Default value for empty cells
          raw: false,           // Process values (dates, numbers, etc.)
          dateNF: 'yyyy-mm-dd', // Date format
          blankrows: false,     // Skip blank rows
          range: undefined      // Auto-detect range
        });

        // Enhanced data processing
        const processedData = processExcelData(jsonData, fileExtension);

        setRows(processedData);
        
        // Store original file as base64 for persistence
        const fileAsDataUrl = await new Promise<string | undefined>((resolve) => {
          try {
            const fr = new FileReader();
            fr.onload = () => resolve(typeof fr.result === 'string' ? fr.result : undefined);
            fr.onerror = () => resolve(undefined);
            fr.readAsDataURL(file);
          } catch {
            resolve(undefined);
          }
        });

        persist({ rows: processedData, fileName: file.name, fileDataUrl: fileAsDataUrl });
        
        const totalRows = processedData.length;
        const dataRows = Math.max(0, totalRows - 1); // Exclude header
        
        toast({
          title: "File uploaded successfully! 🎉",
          description: `${dataRows} data rows loaded from ${file.name} (Sheet: ${selectedSheet})${workbook.SheetNames.length > 1 ? ` • ${workbook.SheetNames.length} sheets available` : ''}`,
        });
      } catch (error) {
        console.error('Excel reading error:', error);
        
        // More specific error messages
        let errorMessage = "Please make sure the file is a valid Excel or CSV file.";
        if (error instanceof Error) {
          if (error.message.includes('No sheets found')) {
            errorMessage = "File tidak memiliki sheet yang valid.";
          } else if (error.message.includes('Invalid file format')) {
            errorMessage = "Format file tidak didukung. Gunakan .xlsx, .xls, .csv, .xlsm, .xlsb, atau .ods";
          } else if (error.message.includes('File too large')) {
            errorMessage = "File terlalu besar. Maksimal 50MB.";
          } else {
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Gagal membaca file",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "File reading error",
        description: "Could not read the file. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  // Enhanced Excel data processing function
  const processExcelData = (jsonData: any[][], fileExtension: string): any[][] => {
    if (!jsonData || jsonData.length === 0) return [];

    // Enhanced cell validation with better edge case handling
    const isCellNonEmpty = (cell: any) => {
      if (cell === null || cell === undefined) return false;
      if (typeof cell === 'string') {
        const trimmed = cell.trim();
        return trimmed.length > 0 && 
               trimmed !== 'null' && 
               trimmed !== 'undefined' &&
               trimmed !== 'N/A' &&
               trimmed !== 'n/a' &&
               trimmed !== '#N/A' &&
               trimmed !== '#VALUE!' &&
               trimmed !== '#REF!';
      }
      if (typeof cell === 'number') {
        return !isNaN(cell) && isFinite(cell);
      }
      return true; // Dates, booleans are considered non-empty
    };

    // Remove fully empty trailing rows
    let lastNonEmptyRowIdx = -1;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] || [];
      if (row.some(isCellNonEmpty)) lastNonEmptyRowIdx = i;
    }
    const trimmedRows = lastNonEmptyRowIdx >= 0 ? jsonData.slice(0, lastNonEmptyRowIdx + 1) : [];

    if (trimmedRows.length === 0) return [];

    // Compute last non-empty column index across remaining rows
    let lastNonEmptyColIdx = -1;
    for (const row of trimmedRows) {
      for (let j = row.length - 1; j >= 0; j--) {
        if (isCellNonEmpty(row[j])) {
          if (j > lastNonEmptyColIdx) lastNonEmptyColIdx = j;
          break;
        }
      }
    }

    // Process and normalize data
    const finalRows = trimmedRows.map(row => {
      const processedRow = lastNonEmptyColIdx >= 0 ? row.slice(0, lastNonEmptyColIdx + 1) : [];
      
      // Normalize each cell value
      return processedRow.map(cell => {
        if (cell === null || cell === undefined) return "";
        
        // Handle different data types
        if (typeof cell === 'number') {
          // Check if it's an Excel date (Excel date serial number)
          if (cell > 1 && cell < 100000 && Number.isInteger(cell)) {
            try {
              const excelDate = new Date((cell - 25569) * 86400 * 1000);
              if (!isNaN(excelDate.getTime()) && excelDate.getFullYear() > 1900 && excelDate.getFullYear() < 2100) {
                return excelDate;
              }
            } catch {
              // If date conversion fails, return as number
            }
          }
          return cell;
        }
        
        if (cell instanceof Date) {
          return cell;
        }
        
        if (typeof cell === 'boolean') {
          return cell;
        }
        
        // Handle strings - including formulas and special values
        const str = String(cell).trim();
        if (str === 'null' || str === 'undefined' || str === '') {
          return "";
        }
        
        // Handle Excel error values
        if (str.startsWith('#') && str.includes('!')) {
          return `Error: ${str}`;
        }
        
        // Handle formulas (they start with =)
        if (str.startsWith('=')) {
          return `Formula: ${str}`;
        }
        
        return str;
      });
    });

    return finalRows;
  };

  const handleExport = (format: 'xlsx' | 'csv' = 'xlsx') => {
    if (rows.length === 0) {
      toast({
        title: "No data to export",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }
    // Always keep header row, filter only data rows
    const header = rows[0] || [];
    const dataRows = filteredDataRows;
    const exportRows = header.length ? [header, ...dataRows] : dataRows;

    const worksheet = XLSX.utils.aoa_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    const baseFileName = fileName.replace(/\.[^/.]+$/, "") + "_export";
    const exportFileName = format === 'csv' ? `${baseFileName}.csv` : `${baseFileName}.xlsx`;
    
    if (format === 'csv') {
      // For CSV ensure proper CSV generation to avoid binary issues
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = exportFileName;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      XLSX.writeFile(workbook, exportFileName, { bookType: 'xlsx' });
    }
    
    toast({
      title: "File exported! 📊",
      description: `Data saved as ${exportFileName}`,
    });
  };

  const clearData = () => {
    setRows([]);
    setFileName("");
    setSearchTerm("");
    setColumnFilters({});
    setIsEditMode(false);
    setHasUnsavedChanges(false);
    setOriginalRows([]);
    // date filters removed
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY } as any));
    } catch {}
    toast({
      title: "Data cleared",
      description: "Ready for a new file upload.",
    });
  };

  // Edit mode functions
  const toggleEditMode = () => {
    if (!isEditMode) {
      setOriginalRows([...rows]);
    }
    setIsEditMode(!isEditMode);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: any) => {
    if (!isEditMode) return;
    
    setRows(prevRows => {
      const newRows = [...prevRows];
      if (!newRows[rowIndex]) {
        newRows[rowIndex] = [];
      }
      newRows[rowIndex] = [...newRows[rowIndex]];
      newRows[rowIndex][colIndex] = value;
      
      // Dispatch real-time update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("excelhub:data-updated", { 
          detail: { rows: newRows, fileName, updatedAt: Date.now() }
        }));
      }, 0);
      
      return newRows;
    });
    setHasUnsavedChanges(true);
  };

  const addRow = (afterIndex?: number) => {
    if (!isEditMode) return;
    
    const insertIndex = afterIndex !== undefined ? afterIndex + 1 : rows.length;
    const newRow = new Array(headers.length).fill("");
    
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows.splice(insertIndex, 0, newRow);
      
      // Dispatch real-time update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("excelhub:data-updated", { 
          detail: { rows: newRows, fileName, updatedAt: Date.now() }
        }));
      }, 0);
      
      return newRows;
    });
    setHasUnsavedChanges(true);
    
    toast({
      title: "Row added",
      description: `New row added at position ${insertIndex + 1}`,
    });
  };

  const deleteRow = (rowIndex: number) => {
    if (!isEditMode || rowIndex === 0) return; // Don't delete header row
    
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows.splice(rowIndex, 1);
      
      // Dispatch real-time update event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("excelhub:data-updated", { 
          detail: { rows: newRows, fileName, updatedAt: Date.now() }
        }));
      }, 0);
      
      return newRows;
    });
    setHasUnsavedChanges(true);
    
    toast({
      title: "Row deleted",
      description: `Row ${rowIndex + 1} has been deleted`,
    });
  };

  const saveChanges = () => {
    if (!hasUnsavedChanges) return;
    
    // Update the stored data
    persist({ rows, fileName });
    setHasUnsavedChanges(false);
    setOriginalRows([...rows]);
    
    toast({
      title: "Changes saved! 💾",
      description: "Your modifications have been saved to the Excel file.",
    });
  };

  const cancelChanges = () => {
    if (!hasUnsavedChanges) {
      setIsEditMode(false);
      return;
    }
    
    setRows([...originalRows]);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
    
    toast({
      title: "Changes cancelled",
      description: "All modifications have been reverted.",
    });
  };

  // Date helpers and detection (hoisted before use)
  function parseCellToDate(cell: any): Date | null {
    if (cell === null || cell === undefined) return null;
    if (cell instanceof Date) return cell;
    if (typeof cell === 'number') {
      try {
        const o = XLSX.SSF.parse_date_code(cell);
        if (!o) return null;
        // Construct as LOCAL time to avoid UTC offset shifting during comparisons
        return new Date(o.y, (o.m || 1) - 1, o.d || 1, o.H || 0, o.M || 0, o.S || 0);
      } catch {
        return null;
      }
    }
    const text = String(cell).trim();
    // Try safe parsing: prefer mm/dd/yyyy or dd/mm/yyyy with Date constructor
    const parsed = new Date(text);
    if (!isNaN(parsed.getTime())) return parsed;
    return null;
  }

  function toLocalDateOnly(year: number, monthIndexZeroBased: number, day: number): Date {
    return new Date(year, monthIndexZeroBased, day, 0, 0, 0, 0);
  }

  function parseDateInputLocal(dateStr?: string): { start?: Date; end?: Date } {
    if (!dateStr) return {};
    // Expect browser date input emits yyyy-mm-dd; if mm/dd/yyyy, Date will still handle locally
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return {};
    const start = toLocalDateOnly(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 23, 59, 59, 999);
    return { start, end };
  }

  const filteredDataRows = useMemo(() => {
    // Only filter on data rows (exclude header at index 0)
    const dataRows = rows.slice(1);
    const lowered = searchTerm.toLowerCase();

    return dataRows.filter(row => {
      // Free text filter
      const matchesSearch = !searchTerm || row.some(cell => cell?.toString().toLowerCase().includes(lowered));
      if (!matchesSearch) return false;

      // Column filters: each active column must include one of selected values
      for (const colIdxStr of Object.keys(columnFilters)) {
        const colIdx = Number(colIdxStr);
        const selected = columnFilters[colIdx];
        if (!selected || selected.size === 0) continue;
        const cellVal = row[colIdx];
        const normalized = (cellVal === null || cellVal === undefined) ? "" : String(cellVal);
        if (!selected.has(normalized)) return false;
      }

      // Date range filters removed
      return true;
    });
  }, [rows, searchTerm, columnFilters]);

  const filteredRows = useMemo(() => {
    // Compose final rows: header (if exists) + filtered data rows
    const header = rows[0] || [];
    return header.length ? [header, ...filteredDataRows] : filteredDataRows;
  }, [rows, filteredDataRows]);

  const headers = useMemo(() => (rows[0] || []) as any[], [rows]);

  const uniqueValuesByColumn = useMemo(() => {
    const map: Record<number, string[]> = {};
    const dataRows = rows.slice(1);
    const width = headers.length || Math.max(0, ...dataRows.map(r => r?.length || 0));
    for (let c = 0; c < width; c++) {
      const set = new Set<string>();
      for (const r of dataRows) {
        const v = (r && r[c] !== undefined && r[c] !== null) ? String(r[c]) : "";
        set.add(v);
      }
      // Stable, trimmed list
      map[c] = Array.from(set);
    }
    return map;
  }, [rows, headers]);

  const toggleColumnFilter = (columnIndex: number, value: string) => {
    setColumnFilters(prev => {
      const next = { ...prev };
      const existing = new Set<string>(
        next[columnIndex] ? Array.from(next[columnIndex] as Set<string>) : []
      );
      if (existing.has(value)) existing.delete(value); else existing.add(value);
      next[columnIndex] = existing;
      return next;
    });
  };

  const clearColumnFilter = (columnIndex: number) => {
    setColumnFilters(prev => {
      const next = { ...prev };
      delete next[columnIndex];
      return next;
    });
  };

  // Date helpers and detection

  // Date filters removed

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored?.rows?.length) {
      setRows(stored.rows);
      setFileName(stored.fileName || "");
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key && e.key !== STORAGE_KEY) return;
      const latest = loadFromStorage();
      if (latest) {
        setRows(latest.rows || []);
        setFileName(latest.fileName || "");
      } else {
        setRows([]);
        setFileName("");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    rows,
    fileName,
    searchTerm,
    isLoading,
    filteredRows,
    headers,
    uniqueValuesByColumn,
    columnFilters,
    isEditMode,
    hasUnsavedChanges,
    setSearchTerm,
    handleFileUpload,
    handleExport,
    clearData,
    toggleColumnFilter,
    clearColumnFilter,
    toggleEditMode,
    updateCell,
    addRow,
    deleteRow,
    saveChanges,
    cancelChanges,
  };
}