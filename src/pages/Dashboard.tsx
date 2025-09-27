import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useExcelData } from "@/hooks/useExcelData";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  // Use the same data source as ExcelDashboard for consistency
  const {
    rows,
    fileName,
    filteredRows,
    headers,
  } = useExcelData();

  // Responsive viewport handling
  const [isTiny, setIsTiny] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  
  // Chart refs for export
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  
  // Loading and animation states
  const [isChartLoading, setIsChartLoading] = useState<boolean>(false);
  const [chartAnimationKey, setChartAnimationKey] = useState<number>(0);
  
  // Chart interaction states
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);
  const [selectedBarItem, setSelectedBarItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Chart customization states
  const [colorScheme, setColorScheme] = useState<'default' | 'pastel' | 'vibrant' | 'monochrome'>('default');
  
  useEffect(() => {
    const tinyMq = window.matchMedia("(max-width: 360px)");
    const mobileMq = window.matchMedia("(max-width: 640px)");
    const tabletMq = window.matchMedia("(max-width: 1024px)");
    
    const update = () => {
      try {
        setIsTiny(tinyMq.matches);
        setIsMobile(mobileMq.matches);
        setIsTablet(tabletMq.matches);
      } catch (error) {
        console.warn('Error updating viewport state:', error);
      }
    };
    
    try {
      update();
      tinyMq.addEventListener?.("change", update);
      mobileMq.addEventListener?.("change", update);
      tabletMq.addEventListener?.("change", update);
    } catch (error) {
      console.warn('Error setting up viewport listeners:', error);
    }
    
    return () => {
      try {
        tinyMq.removeEventListener?.("change", update);
        mobileMq.removeEventListener?.("change", update);
        tabletMq.removeEventListener?.("change", update);
      } catch (error) {
        console.warn('Error cleaning up viewport listeners:', error);
      }
    };
  }, []);

  // Export Recharts (SVG) as PNG by serializing the SVG and drawing to canvas
  const exportChartAsImage = (chartRef: React.RefObject<HTMLDivElement>, filename: string) => {
    const container = chartRef.current;
    if (!container) return;
    const svg = container.querySelector('svg') as SVGSVGElement | null;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    // Inline computed fill/stroke colors so exported SVG keeps theme colors
    const cloned = svg.cloneNode(true) as SVGSVGElement;
    const inlineStyles = (el: Element) => {
      const win = window as any;
      const cs = window.getComputedStyle(el as Element);
      const fill = cs.fill;
      const stroke = cs.stroke;
      if (fill && fill !== 'none') (el as any).setAttribute('fill', fill);
      if (stroke && stroke !== 'none') (el as any).setAttribute('stroke', stroke);
      for (let i = 0; i < el.children.length; i++) inlineStyles(el.children[i]);
    };
    inlineStyles(cloned);

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(cloned);

    if (!source.match(/^\<\?xml/)) {
      source = `<?xml version="1.0" standalone="no"?>\r\n` + source;
    }

    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }
      // White background for better contrast
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Export chart as SVG
  const exportChartAsSVG = (chartRef: React.RefObject<HTMLDivElement>, filename: string) => {
    const container = chartRef.current;
    if (!container) return;
    const svg = container.querySelector('svg') as SVGSVGElement | null;
    if (!svg) return;

    // Inline computed fill/stroke colors so exported SVG keeps theme colors
    const cloned = svg.cloneNode(true) as SVGSVGElement;
    const inlineStyles = (el: Element) => {
      const cs = window.getComputedStyle(el as Element);
      const fill = cs.fill;
      const stroke = cs.stroke;
      if (fill && fill !== 'none') (el as any).setAttribute('fill', fill);
      if (stroke && stroke !== 'none') (el as any).setAttribute('stroke', stroke);
      for (let i = 0; i < el.children.length; i++) inlineStyles(el.children[i]);
    };
    inlineStyles(cloned);

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(cloned);

    if (!source.match(/^\<\?xml/)) {
      source = `<?xml version="1.0" standalone="no"?>\r\n` + source;
    }

    const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Export chart as PDF (requires jsPDF)
  const exportChartAsPDF = async (chartRef: React.RefObject<HTMLDivElement>, filename: string) => {
    const container = chartRef.current;
    if (!container) return;
    const svg = container.querySelector('svg') as SVGSVGElement | null;
    if (!svg) return;

    try {
      // Dynamic import for jsPDF
      const { default: jsPDF } = await import('jspdf');
      
      const rect = svg.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      // Inline computed fill/stroke colors
      const cloned = svg.cloneNode(true) as SVGSVGElement;
      const inlineStyles = (el: Element) => {
        const cs = window.getComputedStyle(el as Element);
        const fill = cs.fill;
        const stroke = cs.stroke;
        if (fill && fill !== 'none') (el as any).setAttribute('fill', fill);
        if (stroke && stroke !== 'none') (el as any).setAttribute('stroke', stroke);
        for (let i = 0; i < el.children.length; i++) inlineStyles(el.children[i]);
      };
      inlineStyles(cloned);

      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(cloned);

      if (!source.match(/^\<\?xml/)) {
        source = `<?xml version="1.0" standalone="no"?>\r\n` + source;
      }

      const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: width > height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [width, height]
        });
        
        pdf.addImage(img, 'PNG', 0, 0, width, height);
        pdf.save(`${filename}.pdf`);
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        console.error('Failed to load image for PDF export');
      };
      
      img.src = url;
    } catch (error) {
      console.error('Failed to export PDF:', error);
      // Fallback to PNG export
      exportChartAsImage(chartRef, filename);
    }
  };

  const nonEmptyRows = useMemo(() => {
    // Use filteredRows from useExcelData hook to ensure consistency with search and column filters
    // exclude header and fully empty rows
    return filteredRows.slice(1).filter(r => {
      if (!r || r.length === 0) return false;
      
      // Check if row has any meaningful data
      return r.some((c: any) => {
        if (c === null || c === undefined) return false;
        const str = String(c).trim();
        if (str === "" || str === "null" || str === "undefined" || str === "N/A" || str === "n/a") return false;
        return true;
      });
    });
  }, [filteredRows]);

  // Derive simple analytics from the first two columns:
  // - Column 1 (index 0) as category for pie chart (frequency distribution)
  // - Column 2 (index 1) as numeric for line chart over row index
  // Color schemes for chart customization
  const COLOR_SCHEMES = {
    default: [
      "#ff6384", "#36a2eb", "#ffcd56", "#4bc0c0", "#9966ff", "#ff9f40", 
      "#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#e11d48", "#14b8a6"
    ],
    pastel: [
      "#ffb3ba", "#bae1ff", "#baffc9", "#ffffba", "#ffdfba", "#e6b3ff",
      "#ffb3d9", "#b3ffb3", "#b3d9ff", "#ffffb3", "#ffb3b3", "#b3ffff"
    ],
    vibrant: [
      "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
      "#ff8000", "#8000ff", "#00ff80", "#ff0080", "#80ff00", "#0080ff"
    ],
    monochrome: [
      "#1f2937", "#374151", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db",
      "#e5e7eb", "#f3f4f6", "#f9fafb", "#111827", "#1f2937", "#374151"
    ]
  };

  const PIE_COLORS = COLOR_SCHEMES[colorScheme];
  const [categoryCol, setCategoryCol] = useState<number>(0);
  const [numericCol, setNumericCol] = useState<number>(1);
  const [aggregation, setAggregation] = useState<"sum" | "count">("sum");
  const categoryHeader = headers[categoryCol] ? String(headers[categoryCol]) : "Category";
  const numericHeader = headers[numericCol] ? String(headers[numericCol]) : "Value";

  function isLongNumericId(s: string): boolean {
    return /^[0-9]{10,}$/.test(s);
  }

  function toDisplayLabel(s: string): string {
    if (!s || s.trim() === "") return "";
    
    const trimmed = s.trim();
    
    // Handle long numeric IDs
    if (isLongNumericId(trimmed)) return `…${trimmed.slice(-5)}`;
    
    // Handle very long strings - use consistent truncation
    if (trimmed.length > 20) return `${trimmed.slice(0, 17)}…`;
    
    return trimmed;
  }

  // Keep selected columns in range when data changes
  useEffect(() => {
    const maxIdx = Math.max(0, headers.length - 1);
    setCategoryCol((c) => Math.min(c, maxIdx));
    setNumericCol((n) => Math.min(n, maxIdx));
  }, [headers]);

  // Handle chart loading animation when data changes
  useEffect(() => {
    if (nonEmptyRows.length > 0) {
      setIsChartLoading(true);
      setChartAnimationKey(prev => prev + 1);
      
      const timer = setTimeout(() => {
        setIsChartLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [nonEmptyRows, categoryCol, numericCol, aggregation]);

  // Numeric parsing function (must be defined before parseCellValue)
  const parseNumeric = (v: unknown) => {
    if (typeof v === "number") return v;
    let s = String(v ?? "").trim();
    if (s === "") return 0;
    // Remove currency symbols/letters/spaces except separators and sign
    s = s.replace(/[^0-9,.-]/g, "");

    const hasComma = s.includes(",");
    const hasDot = s.includes(".");

    // Decide decimal separator and normalize to '.'
    if (hasComma && hasDot) {
      // Use the rightmost separator as decimal; remove the other as thousand
      const lastComma = s.lastIndexOf(",");
      const lastDot = s.lastIndexOf(".");
      if (lastComma > lastDot) {
        // comma as decimal, dots as thousand
        s = s.replace(/\./g, "").replace(",", ".");
      } else {
        // dot as decimal, commas as thousand
        s = s.replace(/,/g, "");
      }
    } else if (hasComma && !hasDot) {
      // If single comma near the end, treat as decimal; otherwise thousand sep
      const commaCount = (s.match(/,/g) || []).length;
      if (commaCount === 1 && s.length - s.lastIndexOf(",") <= 3) {
        s = s.replace(",", ".");
      } else {
        s = s.replace(/,/g, "");
      }
    } else if (!hasComma && hasDot) {
      // If multiple dots, likely thousand separators; remove all dots
      const dotCount = (s.match(/\./g) || []).length;
      if (dotCount > 1) {
        s = s.replace(/\./g, "");
      }
      // else keep single dot as decimal
    }

    // Normalize leading sign multiples
    s = s.replace(/(?!^)-/g, "");

    const num = Number(s);
    return isFinite(num) ? num : 0;
  };

  // Enhanced data parsing function for all chart types
  const parseCellValue = (cellValue: any, isNumeric: boolean = false): string | number => {
    if (cellValue === null || cellValue === undefined) return isNumeric ? 0 : "";
    
    // Handle dates consistently
    if (cellValue instanceof Date) {
      return isNumeric ? cellValue.getTime() : cellValue.toLocaleDateString('id-ID');
    }
    
    // Handle boolean values
    if (typeof cellValue === 'boolean') {
      return isNumeric ? (cellValue ? 1 : 0) : (cellValue ? 'Ya' : 'Tidak');
    }
    
    // Handle Excel date numbers (more accurate range)
    if (typeof cellValue === "number") {
      // Excel time-only serials are fractions of a day (e.g., 0.5 -> 12:00)
      if (cellValue >= 0 && cellValue < 1) {
        const totalMs = Math.round(cellValue * 86400 * 1000);
        const hours = Math.floor(totalMs / (3600 * 1000));
        const minutes = Math.floor((totalMs % (3600 * 1000)) / (60 * 1000));
        const seconds = Math.floor((totalMs % (60 * 1000)) / 1000);
        if (isNumeric) {
          // return milliseconds since start of day to preserve ordering if needed
          return totalMs;
        }
        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        // If no seconds, keep HH:MM; otherwise HH:MM:SS
        return seconds === 0 ? `${hh}:${mm}` : `${hh}:${mm}:${ss}`;
      }
      // Excel date serial numbers are typically between 1 (1900-01-01) and 50000+ (2037+)
      if (cellValue > 1 && cellValue < 100000) {
        // Check if it's likely an Excel date by trying to convert
        const excelDate = new Date((cellValue - 25569) * 86400 * 1000);
        if (!isNaN(excelDate.getTime()) && excelDate.getFullYear() > 1900 && excelDate.getFullYear() < 2100) {
          return isNumeric ? excelDate.getTime() : excelDate.toLocaleDateString();
        }
      }
      
      // If it's a regular number and we need numeric, return as is
      if (isNumeric) {
        return cellValue;
      }
    }
    
    if (isNumeric) {
      return parseNumeric(cellValue);
    }
    
    // For text/category values, normalize consistently
    const str = String(cellValue).trim();
    if (str === "") return "";
    
    // Handle combined date-time strings (local)
    const dateTimePatterns: RegExp[] = [
      /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/, // YYYY-MM-DD HH:MM[:SS]
      /^\d{2}[\/-]\d{2}[\/-]\d{4}\s+\d{1,2}:\d{2}(:\d{2})?$/, // MM/DD/YYYY HH:MM[:SS] or DD-MM-YYYY HH:MM[:SS]
    ];
    if (dateTimePatterns.some((p) => p.test(str))) {
      const dt = new Date(str.replace('T', ' '));
      if (!isNaN(dt.getTime())) {
        return dt.toLocaleString('id-ID', {
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: dt.getSeconds() ? '2-digit' : undefined
        });
      }
    }

    // Handle common date formats with better validation
    const datePatterns = [
      { pattern: /^\d{4}-\d{2}-\d{2}$/, format: "YYYY-MM-DD" }, // YYYY-MM-DD
      { pattern: /^\d{2}\/\d{2}\/\d{4}$/, format: "MM/DD/YYYY" }, // MM/DD/YYYY
      { pattern: /^\d{2}-\d{2}-\d{4}$/, format: "MM-DD-YYYY" }, // MM-DD-YYYY
      { pattern: /^\d{1,2}\/\d{1,2}\/\d{4}$/, format: "M/D/YYYY" }, // M/D/YYYY
      { pattern: /^\d{1,2}\/\d{1,2}\/\d{2}$/, format: "M/D/YY" }, // M/D/YY
    ];
    
    for (const { pattern, format } of datePatterns) {
      if (pattern.test(str)) {
        const date = new Date(str);
        if (!isNaN(date.getTime()) && date.getFullYear() > 1900) {
          // Format date consistently based on locale
          return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });
        }
      }
    }
    
    // Handle time formats
    const timePatterns = [
      /^\d{1,2}:\d{2}(:\d{2})?$/, // HH:MM or HH:MM:SS
      /^\d{1,2}:\d{2}(:\d{2})?\s*(AM|PM|am|pm)$/i, // HH:MM AM/PM
      /^\d{1,2}[\.\-]\d{2}$/, // HH.MM with dot or dash as separator
    ];
    
    for (const pattern of timePatterns) {
      if (pattern.test(str)) {
        const normalized = str.replace('-', ':').replace('.', ':');
        const time = new Date(`2000-01-01 ${normalized}`);
        if (!isNaN(time.getTime())) {
          return time.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
    }
    
    return str;
  };

  // Process categories from filtered data (respects search and column filters)
  const categories = useMemo(() => {
    if (nonEmptyRows.length === 0) return [];
    
    const map = new Map<string, number>();
    const maxRows = Math.min(nonEmptyRows.length, 10000); // Limit processing for performance
    
    for (let i = 0; i < maxRows; i++) {
      const r = nonEmptyRows[i];
      const cellValue = r[categoryCol];
      
      // Skip null, undefined, empty strings, and whitespace-only values
      if (cellValue === null || cellValue === undefined) continue;
      if (typeof cellValue === "string" && cellValue.trim() === "") continue;
      
      const key = parseCellValue(cellValue, false) as string;
      
      // Skip empty keys and common empty values
      if (key === "" || key === "null" || key === "undefined" || key === "N/A" || key === "n/a") continue;
      
      map.set(key, (map.get(key) || 0) + 1);
    }
    
    if (map.size === 0) return [];
    
    // Sort by value desc and keep top N categories, group the rest as "Others"
    const TOP_N = 8;
    const sorted = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    let base = sorted;
    if (sorted.length > TOP_N) {
      const top = sorted.slice(0, TOP_N);
      const othersValue = sorted.slice(TOP_N).reduce((acc, cur) => acc + cur.value, 0);
      const totalValue = sorted.reduce((acc, cur) => acc + cur.value, 0);
      base = othersValue > 0 && (othersValue / totalValue) < 0.5
        ? [...top, { name: "Others", value: othersValue }]
        : top;
    }

    return base.map((d) => ({ ...d, displayName: toDisplayLabel(String(d.name)), fullName: String(d.name) }));
  }, [nonEmptyRows, categoryCol]);

  // Auto-detect a numeric column for the line chart (prefer column 1, else first numeric-rich column)
  const numericColumnIndex = useMemo(() => {
    const prefer = 1;
    const isMostlyNumeric = (col: number) => {
      let numericCount = 0;
      let total = 0;
      for (const r of nonEmptyRows) {
        const v = r[col];
        if (v === undefined) continue;
        total++;
        
        // Use consistent parsing
        const parsed = parseCellValue(v, true) as number;
        if (typeof parsed === "number" && isFinite(parsed) && parsed !== 0) {
          numericCount++;
        }
      }
      return total > 0 && numericCount / total >= 0.6;
    };
    if (isMostlyNumeric(prefer)) return prefer;
    const maxCols = Math.max(0, ...nonEmptyRows.map(r => r.length));
    for (let c = 0; c < maxCols; c++) {
      if (c === 0) continue; // skip category column
      if (isMostlyNumeric(c)) return c;
    }
    return prefer; // fallback
  }, [nonEmptyRows]);

  // Aggregate numeric values by selected category for a clearer comparison (Bar chart)
  // Uses filtered data to ensure consistency with search and column filters
  const categoryAggregates = useMemo(() => {
    const map = new Map<string, number>();
    const col = Number.isFinite(numericCol) ? numericCol : numericColumnIndex;
    
    for (const r of nonEmptyRows) {
      const cellValue = r[categoryCol];
      
      // Skip null, undefined, empty strings, and whitespace-only values
      if (cellValue === null || cellValue === undefined) continue;
      if (typeof cellValue === "string" && cellValue.trim() === "") continue;
      
      const key = parseCellValue(cellValue, false) as string;
      
      // Skip empty keys and common empty values
      if (key === "" || key === "null" || key === "undefined" || key === "N/A" || key === "n/a") continue;
      
      const num = parseCellValue(r[col], true) as number;
      
      // Skip zero or invalid numeric values
      if (typeof num !== "number" || !isFinite(num) || num === 0) continue;
      
      map.set(key, (map.get(key) || 0) + num);
    }
    
    if (map.size === 0) return [];
    
    const TOP_N = 8;
    const sorted = Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    let base = sorted;
    if (sorted.length > TOP_N) {
      const top = sorted.slice(0, TOP_N);
      const othersValue = sorted.slice(TOP_N).reduce((acc, cur) => acc + cur.value, 0);
      const totalValue = sorted.reduce((acc, cur) => acc + cur.value, 0);
      base = othersValue > 0 && (othersValue / totalValue) < 0.5
        ? [...top, { name: "Others", value: othersValue }]
        : top;
    }

    return base.map((d) => ({ ...d, displayName: toDisplayLabel(String(d.name)), fullName: String(d.name) }));
  }, [nonEmptyRows, categoryCol, numericCol, numericColumnIndex]);

  // Choose bar data based on aggregation mode
  const barData = useMemo(() => {
    if (aggregation === "count") return categories;
    return categoryAggregates;
  }, [aggregation, categories, categoryAggregates]);

  const barYAxisLabel = aggregation === "count" ? "Jumlah" : numericHeader;

  // Keep the user's chosen aggregation without auto-reverting to count.
  // If the selected numeric column isn't numeric, sums will render as 0,
  // and the user can switch columns or change aggregation manually.

  const formatAxisNumber = (n: number) => {
    const abs = Math.abs(n);
    const sign = n < 0 ? -1 : 1;
    const fmt = (val: number) => (val % 1 === 0 ? String(val) : val.toFixed(1).replace(/\.0$/, ""));
    if (abs >= 1_000_000_000_000) return `${fmt(sign * (abs / 1_000_000_000_000))}T`;
    if (abs >= 1_000_000_000) return `${fmt(sign * (abs / 1_000_000_000))}B`;
    if (abs >= 1_000_000) return `${fmt(sign * (abs / 1_000_000))}M`;
    if (abs >= 1_000) return `${fmt(sign * (abs / 1_000))}K`;
    try {
      return n.toLocaleString('id-ID');
    } catch {
      return String(n);
    }
  };

  // Auto-scale axis ticks consistently based on data magnitude (keeps plotted values raw)
  const getScale = (maxValue: number) => {
    if (maxValue >= 1_000_000_000_000) return { unit: 1_000_000_000_000, suffix: "T" };
    if (maxValue >= 1_000_000_000) return { unit: 1_000_000_000, suffix: "B" };
    if (maxValue >= 1_000_000) return { unit: 1_000_000, suffix: "M" };
    if (maxValue >= 1_000) return { unit: 1_000, suffix: "K" };
    return { unit: 1, suffix: "" };
  };

  const barMaxValue = useMemo(() => {
    return barData.reduce((m, d: any) => {
      const v = Number(d?.value ?? 0);
      return isFinite(v) && v > m ? v : m;
    }, 0);
  }, [barData]);

  const barScale = useMemo(() => getScale(barMaxValue), [barMaxValue]);

  const barYAxisLabelWithUnit = useMemo(() => {
    if (aggregation === "count" || !barScale.suffix) return barYAxisLabel;
    return `${barYAxisLabel} (${barScale.suffix})`;
  }, [aggregation, barYAxisLabel, barScale]);

  const barMaxValueLabelLen = useMemo(() => {
    let maxLen = 1;
    for (const d of barData) {
      const text = formatAxisNumber(Number((d as any)?.value ?? 0));
      if (text.length > maxLen) maxLen = text.length;
    }
    return maxLen;
  }, [barData]);

  const barYAxisWidth = useMemo(() => {
    const charPx = isTiny ? 7 : 8; // rough estimate per character
    const padding = isTiny ? 14 : 16;
    const min = 44;
    const estimated = Math.ceil(barMaxValueLabelLen * charPx + padding);
    return Math.max(min, Math.min(140, estimated));
  }, [barMaxValueLabelLen, isTiny]);

  const barYCategoryWidth = useMemo(() => {
    const charPx = isTiny ? 7 : 8;
    const padding = isTiny ? 14 : 16;
    const maxLen = Math.max(0, ...barData.map((d: any) => String(d?.displayName ?? d?.name ?? "").length));
    const min = 56;
    const estimated = Math.ceil(maxLen * charPx + padding);
    return Math.max(min, Math.min(220, estimated));
  }, [barData, isTiny]);

  // Consistent pie chart sizing based on container
  const pieChartSizing = useMemo(() => {
    let baseSize = 180; // Default base diameter
    
    if (isTiny) baseSize = 120;
    else if (isMobile) baseSize = 140;
    else if (isTablet) baseSize = 160;
    
    const innerRadius = Math.floor(baseSize * 0.3); // 30% of base size
    const outerRadius = Math.floor(baseSize * 0.45); // 45% of base size
    return { innerRadius, outerRadius };
  }, [isTiny, isMobile, isTablet]);

  // Ensure minimum slice size for better visibility and consistent labeling
  const processedCategories = useMemo(() => {
    if (categories.length === 0) return [];
    
    const total = categories.reduce((sum, cat) => sum + cat.value, 0);
    const minSliceThreshold = total * 0.01; // 1% minimum threshold
    
    return categories.map(cat => ({
      ...cat,
      value: Math.max(cat.value, minSliceThreshold),
      // Ensure displayName is always available and consistent
      displayName: cat.displayName || toDisplayLabel(String(cat.name)),
      // Ensure fullName is always available for tooltips
      fullName: cat.fullName || String(cat.name)
    }));
  }, [categories]);

  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    return {
      categories: processedCategories,
      barData: barData,
      pieColors: PIE_COLORS,
      pieSizing: pieChartSizing
    };
  }, [processedCategories, barData, pieChartSizing]);

  const barTooltipFormatter = (
    value: number,
    _name: string,
    item: any,
  ) => {
    const catName = item?.payload?.fullName ?? item?.payload?.name ?? "";
    const units = aggregation === "count" ? (categoryHeader.toLowerCase().includes("city") ? "Kota" : "Item") : numericHeader;
    const valShort = typeof value === "number" ? formatAxisNumber(value / (barScale.unit || 1)) : String(value);
    const valFull = typeof value === "number" ? (() => { try { return value.toLocaleString('id-ID'); } catch { return String(value); } })() : String(value);
    
    return [
      `${valShort}${barScale.suffix ? barScale.suffix : ""} ${units}`,
      `📊 ${catName}`
    ];
  };

  const preferHorizontal = useMemo(() => {
    const maxLabelLen = Math.max(0, ...barData.map((d: any) => String(d?.fullName ?? d?.name ?? "").length));
    return barData.length > 6 || maxLabelLen > 14 || isTiny || isMobile;
  }, [barData, isTiny, isMobile]);

  // Data statistics summary
  const dataStats = useMemo(() => {
    if (nonEmptyRows.length === 0) return null;
    
    const totalRows = nonEmptyRows.length;
    const totalColumns = headers.length;
    
    // Calculate numeric columns stats
    const numericStats = headers.map((header, colIndex) => {
      const values = nonEmptyRows.map(row => parseCellValue(row[colIndex], true) as number)
        .filter(val => typeof val === "number" && isFinite(val) && val !== 0);
      
      if (values.length === 0) return null;
      
      const sum = values.reduce((acc, val) => acc + val, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      return {
        column: String(header || `Column ${colIndex + 1}`),
        count: values.length,
        sum: sum,
        avg: avg,
        min: min,
        max: max
      };
    }).filter(Boolean);
    
    return {
      totalRows,
      totalColumns,
      numericColumns: numericStats.length,
      numericStats
    };
  }, [nonEmptyRows, headers]);

  // Chart loading skeleton component
  const ChartLoadingSkeleton = ({ height = "h-[260px]" }: { height?: string }) => (
    <div className={`flex flex-col items-center justify-center space-y-4 ${height}`}>
      <div className="flex space-x-2">
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <p className="text-sm text-muted-foreground">Memproses data chart...</p>
    </div>
  );

  // Chart interaction handlers
  const handlePieClick = (data: any) => {
    if (selectedPieSlice === data.name) {
      setSelectedPieSlice(null); // Deselect if clicking the same slice
    } else {
      setSelectedPieSlice(data.name);
    }
  };

  const handleBarClick = (data: any) => {
    if (selectedBarItem === data.name) {
      setSelectedBarItem(null); // Deselect if clicking the same bar
    } else {
      setSelectedBarItem(data.name);
    }
  };

  const handlePieMouseEnter = useCallback((data: any) => {
    if (data) {
      const itemName = data.name || data.displayName || data.fullName;
      if (itemName) {
        setHoveredItem(itemName);
      }
    }
  }, []);

  const handlePieMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Chart statistics component
  const ChartStatistics = ({ data, type, aggregation }: { 
    data: any[], 
    type: 'pie' | 'bar', 
    aggregation?: string 
  }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    const max = Math.max(...data.map(item => item.value || 0));
    const min = Math.min(...data.map(item => item.value || 0));
    const avg = total / data.length;
    const maxItem = data.find(item => item.value === max);
    const minItem = data.find(item => item.value === min);
    
    const selectedItem = type === 'pie' ? selectedPieSlice : selectedBarItem;
    const selectedData = data.find(item => item.name === selectedItem);

    return (
      <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Statistik Ringkasan
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <p className="text-muted-foreground">Total</p>
            <p className="font-medium">{formatAxisNumber(total)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Rata-rata</p>
            <p className="font-medium">{formatAxisNumber(avg)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Tertinggi</p>
            <p className="font-medium" title={maxItem?.fullName || maxItem?.name}>
              {maxItem?.displayName || maxItem?.name || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Terendah</p>
            <p className="font-medium" title={minItem?.fullName || minItem?.name}>
              {minItem?.displayName || minItem?.name || 'N/A'}
            </p>
          </div>
        </div>
        {type === 'pie' && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {data.length} kategori • Total {total.toLocaleString('id-ID')} item
            </p>
          </div>
        )}
        {type === 'bar' && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {data.length} kategori • {aggregation === 'count' ? 'Jumlah per kategori' : `Total ${numericHeader} per kategori`}
            </p>
          </div>
        )}
        {selectedData && (
          <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-primary">
                {type === 'pie' ? '🍰' : '📊'} Item Terpilih:
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  if (type === 'pie') setSelectedPieSlice(null);
                  else setSelectedBarItem(null);
                }}
              >
                ✕
              </Button>
            </div>
            <p className="text-sm font-medium">
              {selectedData.displayName || selectedData.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Nilai: {formatAxisNumber(selectedData.value)} • 
              Persentase: {((selectedData.value / total) * 100).toFixed(1)}%
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`p-4 sm:p-6 space-y-4 sm:space-y-6 ${isTiny ? "p-2 space-y-3" : ""}`}>
      <div className="space-y-2">
        <h1 className={`font-bold bg-gradient-hero bg-clip-text text-transparent ${isTiny ? "text-2xl" : "text-3xl"}`}>
          Analytics
        </h1>
        <p className="text-muted-foreground">
          {fileName ? `Sumber: ${fileName} • Grafik mencerminkan pengaturan pencarian dan filter saat ini` : "Unggah file untuk melihat grafik"}
        </p>
      </div>

      {/* Data Summary removed as requested */}

      <div className={`grid gap-4 sm:gap-6 min-w-0 ${
        isTiny ? "grid-cols-1" : 
        isMobile ? "grid-cols-1" : 
        isTablet ? "grid-cols-1 lg:grid-cols-2" : 
        "grid-cols-1 lg:grid-cols-2"
      }`}>
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className={`items-start sm:items-center justify-between gap-3 ${isTiny ? "flex flex-col" : "flex flex-wrap"}`}>
              <CardTitle>{`Distribusi berdasarkan ${categoryHeader}`}</CardTitle>
              <div className={`flex gap-2 ${isTiny ? "w-full" : "w-auto"} flex-wrap`}>
                <div className={`${isTiny ? "flex-1" : "w-40"} sm:w-56 min-w-0`}>
                  <Select value={String(categoryCol)} onValueChange={(v) => setCategoryCol(Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h, idx) => (
                        <SelectItem key={idx} value={String(idx)}>
                          {h ? String(h) : `Column ${idx + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className={`${isTiny ? "flex-1" : "w-32"} sm:w-40 min-w-0`}>
                  <Select value={colorScheme} onValueChange={(v) => setColorScheme(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`shrink-0 whitespace-nowrap ${isTiny ? "w-full" : ""}`}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportChartAsImage(pieChartRef, `pie-chart-${categoryHeader}`)}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportChartAsSVG(pieChartRef, `pie-chart-${categoryHeader}`)}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportChartAsPDF(pieChartRef, `pie-chart-${categoryHeader}`)}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isChartLoading ? (
              <ChartLoadingSkeleton height={
                isTiny ? "h-[200px]" : 
                isMobile ? "h-[240px]" : 
                isTablet ? "h-[280px]" : 
                "h-[320px]"
              } />
            ) : chartData.categories.length === 0 ? (
              <div className={`flex flex-col items-center justify-center text-center px-4 ${
                isTiny ? "h-[200px]" : 
                isMobile ? "h-[240px]" : 
                isTablet ? "h-[280px]" : 
                "h-[320px]"
              }`}>
                <div className="text-muted-foreground mb-2">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  {fileName ? "Tidak ada kategori pada kolom yang dipilih" : "Unggah file untuk melihat distribusi kategori"}
                </p>
                {!fileName && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Pilih kolom dengan data kategorikal untuk hasil terbaik
                  </p>
                )}
              </div>
            ) : (
              <div ref={pieChartRef} className="min-w-0">
              <ChartContainer
                key={`pie-${chartAnimationKey}`}
                config={{ 
                  value: { 
                    label: "Jumlah", 
                    color: "hsl(var(--primary))" 
                  },
                  ...chartData.categories.reduce((acc, _, idx) => ({
                    ...acc,
                    [idx]: {
                      label: chartData.categories[idx]?.name || `Category ${idx + 1}`,
                      color: chartData.pieColors[idx % chartData.pieColors.length]
                    }
                  }), {})
                }}
                className={`w-full pie-chart-label ${
                  isTiny ? "pie-chart-label-tiny h-[200px]" : 
                  isMobile ? "h-[240px]" : 
                  isTablet ? "h-[280px]" : 
                  "h-[320px]"
                } min-w-0`}
                style={{
                  '--chart-label-font-size': isTiny ? '10px' : '12px',
                  '--chart-label-color': 'hsl(var(--foreground))',
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                } as React.CSSProperties}
              >
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.categories}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={chartData.pieSizing.innerRadius}
                    outerRadius={chartData.pieSizing.outerRadius}
                    labelLine={false}
                    cx="50%"
                    cy="50%"
                    animationBegin={0}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    onClick={handlePieClick}
                    label={({ name, percent, value, payload }) => {
                      // Only show labels for slices that are large enough to be readable
                      // Adjust threshold based on screen size and number of categories
                      const minPercent = isTiny ? 0.08 : 0.05;
                      if (percent < minPercent) return null;
                      
                      // Handle edge cases
                      if (!name && !payload?.displayName) return null;
                      
                      // Use displayName from payload for consistent truncation
                      const displayName = payload?.displayName || toDisplayLabel(String(name || ""));
                      const percentage = (percent * 100).toFixed(1);
                      const count = value.toLocaleString('id-ID');
                      
                      // Enhanced formatting with better readability
                      if (isTiny) {
                        return `${percentage}%`;
                      } else if (percent < 0.1) {
                        // For small slices, show only percentage
                        return `${percentage}%`;
                      } else {
                        // For larger slices, show name and percentage
                        return `${displayName}\n${percentage}%`;
                      }
                    }}
                  >
                    {chartData.categories.map((entry, idx) => {
                      const entryName = entry.name || entry.displayName || entry.fullName;
                      const isSelected = selectedPieSlice === entryName;
                      const isHovered = hoveredItem === entryName;
                      const baseColor = chartData.pieColors[idx % chartData.pieColors.length];
                      
                      return (
                        <Cell 
                          key={idx} 
                          fill={baseColor}
                          stroke={isSelected ? "#000" : isHovered ? "#666" : "transparent"}
                          strokeWidth={isSelected ? 2 : isHovered ? 1 : 0}
                          onMouseEnter={() => handlePieMouseEnter(entry)}
                          onMouseLeave={handlePieMouseLeave}
                          style={{
                            filter: isSelected ? 'brightness(1.1)' : isHovered ? 'brightness(1.05)' : 'none',
                            cursor: 'pointer',
                            transform: isSelected ? 'scale(1.02)' : isHovered ? 'scale(1.01)' : 'scale(1)'
                          }}
                        />
                      );
                    })}
                  </Pie>
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        nameKey="displayName" 
                        formatter={(value, name, item) => {
                          const percentage = item?.payload?.percent ? (item.payload.percent * 100).toFixed(1) : '0.0';
                          const fullName = item?.payload?.fullName || name;
                          const count = Number(value).toLocaleString('id-ID');
                          return [
                            `${count} item (${percentage}%)`,
                            fullName
                          ];
                        }}
                        labelFormatter={(label) => `📊 ${label}`}
                        className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl rounded-lg p-2"
                      />
                    } 
                  />
                  {chartData.categories.length > 1 && (
                    <ChartLegend 
                      content={
                        <ChartLegendContent 
                          nameKey="displayName"
                          className={`flex-wrap justify-center gap-x-3 gap-y-1 text-foreground ${
                            isTiny ? 'text-xs' : 'text-sm'
                          }`}
                          payload={chartData.categories.map((entry, index) => ({
                            ...entry,
                            color: chartData.pieColors[index % chartData.pieColors.length],
                            value: `${entry.displayName} (${((entry.value / chartData.categories.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}%)`
                          }))}
                        />
                      } 
                    />
                  )}
                </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              </div>
            )}
            {!isChartLoading && chartData.categories.length > 0 && (
              <ChartStatistics data={chartData.categories} type="pie" />
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <div className={`items-start sm:items-center justify-between gap-3 ${isTiny ? "flex flex-col" : "flex flex-wrap"}`}>
              <CardTitle>
                {aggregation === "count" ? `Jumlah per ${categoryHeader}` : `Total ${numericHeader} per ${categoryHeader}`}
              </CardTitle>
              <div className={`gap-2 w-full md:w-auto ${isTiny ? "flex flex-col sm:flex-row" : "flex flex-wrap"}`}>
                <div className={`${isTiny ? "w-full" : "w-32"} sm:w-40 min-w-0`}>
                  <Select value={aggregation} onValueChange={(v) => setAggregation(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Aggregation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sum">Sum</SelectItem>
                      <SelectItem value="count">Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={`${isTiny ? "w-full" : "w-36"} sm:w-56 min-w-0`}>
                  <Select value={String(numericCol)} onValueChange={(v) => setNumericCol(Number(v))} disabled={aggregation === "count"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select numeric column" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h, idx) => (
                        <SelectItem key={idx} value={String(idx)}>
                          {h ? String(h) : `Column ${idx + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className={`${isTiny ? "w-full" : "w-32"} sm:w-40 min-w-0`}>
                  <Select value={colorScheme} onValueChange={(v) => setColorScheme(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="pastel">Pastel</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="monochrome">Monochrome</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`shrink-0 whitespace-nowrap ${isTiny ? "w-full" : ""}`}
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => exportChartAsImage(barChartRef, `bar-chart-${categoryHeader}`)}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportChartAsSVG(barChartRef, `bar-chart-${categoryHeader}`)}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      SVG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportChartAsPDF(barChartRef, `bar-chart-${categoryHeader}`)}>
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-auto min-w-0">
            {isChartLoading ? (
              <ChartLoadingSkeleton height={
                isTiny ? "h-[200px]" : 
                isMobile ? "h-[240px]" : 
                isTablet ? "h-[280px]" : 
                "h-[320px]"
              } />
            ) : barData.length === 0 ? (
              <div className={`flex items-center justify-center text-muted-foreground text-center px-3 sm:px-6 ${
                isTiny ? "h-[200px]" : 
                isMobile ? "h-[240px]" : 
                isTablet ? "h-[280px]" : 
                "h-[320px]"
              }`}>
                {aggregation === "sum"
                  ? "Tidak ada nilai numerik pada kolom yang dipilih. Beralih ke Jumlah bisa membantu."
                  : "Tidak ada kategori untuk diagregasi. Unggah data atau pilih kolom lain."}
              </div>
            ) : (
              <div ref={barChartRef} className="min-w-0">
              <ChartContainer
                key={`bar-${chartAnimationKey}`}
                config={{ value: { label: barYAxisLabelWithUnit, color: "hsl(var(--primary))" } }}
                className={`min-w-full ${
                  isTiny ? "h-[200px]" : 
                  isMobile ? "h-[240px]" : 
                  isTablet ? "h-[280px]" : 
                  "h-[320px]"
                }`}
                style={{
                  '--chart-tick-font-size': isTiny ? '10px' : '12px',
                  '--chart-tick-color': 'hsl(var(--muted-foreground))',
                  animation: 'fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                } as React.CSSProperties}
              >
                {preferHorizontal ? (
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ left: 8, right: 10, top: 8, bottom: 12 }}
                    barCategoryGap={isTiny ? "12%" : "14%"}
                    barSize={isTiny ? 14 : 18}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(v) => {
                        const scaled = Number(v) / (barScale.unit || 1);
                        return formatAxisNumber(scaled) + (barScale.suffix ? barScale.suffix : "");
                      }}
                      tick={{ fontSize: isTiny ? 10 : 12, fill: 'currentColor' }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="displayName" 
                      width={barYCategoryWidth} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fontSize: isTiny ? 10 : 12, fill: 'currentColor' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="var(--color-value)" 
                      radius={[0,4,4,0]} 
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      onClick={handleBarClick}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          nameKey="displayName" 
                          formatter={barTooltipFormatter}
                          className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl rounded-lg p-2"
                        />
                      } 
                    />
                  </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={barData} 
                    margin={{ left: 10, right: 10, top: 8, bottom: 24 }} 
                    barCategoryGap={isTiny ? "10%" : "12%"}
                    barSize={isTiny ? 14 : 18}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="displayName"
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                      angle={isTiny ? -45 : -30}
                      dy={isTiny ? 18 : 16}
                      height={isTiny ? 78 : 70}
                      minTickGap={4}
                      tick={{ fontSize: isTiny ? 9 : 11, fill: 'currentColor', width: 60 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      width={barYAxisWidth} 
                      allowDecimals 
                      tickFormatter={(v) => {
                        const scaled = Number(v) / (barScale.unit || 1);
                        return formatAxisNumber(scaled) + (barScale.suffix ? barScale.suffix : "");
                      }}
                      tick={{ fontSize: isTiny ? 10 : 12, fill: 'currentColor' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="var(--color-value)" 
                      radius={[4,4,0,0]} 
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                      onClick={handleBarClick}
                      style={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                    <ChartTooltip 
                      content={
                        <ChartTooltipContent 
                          nameKey="displayName" 
                          formatter={barTooltipFormatter}
                          className="bg-background/95 backdrop-blur-sm border-border/50 shadow-xl rounded-lg p-2"
                        />
                      } 
                    />
                  </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
              </div>
            )}
            {!isChartLoading && barData.length > 0 && (
              <ChartStatistics data={barData} type="bar" aggregation={aggregation} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
