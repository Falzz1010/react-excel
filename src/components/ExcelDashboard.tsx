import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useExcelData } from "@/hooks/useExcelData";
import { FileUpload } from "@/components/FileUpload";
import { SearchControls } from "@/components/SearchControls";
import { ExportControls } from "@/components/ExportControls";
import { DataTable } from "@/components/DataTable";
import { ColumnFilters } from "./ColumnFilters";
import { EditControls } from "@/components/EditControls";
import { EmptyState } from "@/components/EmptyState";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExcelDashboard() {
  const {
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
  } = useExcelData();

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const activeFilterCount = Object.values(columnFilters || {}).reduce((acc, set) => acc + (set?.size || 0), 0);
  const hasActiveFilters = activeFilterCount > 0;

  const clearAllFilters = () => {
    headers?.forEach((_, idx) => clearColumnFilter(idx));
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6 overflow-x-hidden">
      {/* Header removed */}

      {/* Upload Section */}
      <FileUpload 
        fileName={fileName}
        isLoading={isLoading}
        onFileUpload={onFileUpload}
      />

      {/* Controls */}
      {rows.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardContent className="pt-3 sm:pt-4 md:pt-6">
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 items-start lg:items-center justify-between">
              <div className="w-full lg:flex-1 min-w-0">
                <SearchControls
                  searchTerm={searchTerm}
                  filteredCount={Math.max(0, filteredRows.length - (filteredRows[0]?.length ? 1 : 0))}
                  totalCount={Math.max(0, rows.length - (rows[0]?.length ? 1 : 0))}
                  onSearchChange={setSearchTerm}
                />
              </div>
              <div className="w-full lg:w-auto flex-shrink-0 overflow-x-auto">
                <ExportControls
                  onExportExcel={() => handleExport('xlsx')}
                  onExportCSV={() => handleExport('csv')}
                  onClear={clearData}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{activeFilterCount} filter aktif</Badge>
                <Button size="sm" variant="ghost" className="h-7 px-2" onClick={clearAllFilters}>Clear all</Button>
              </div>
            )}
            
            {/* Edit Controls */}
            <div className="mt-2 sm:mt-3 md:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 items-start sm:items-center justify-between">
              <EditControls
                isEditMode={isEditMode}
                hasUnsavedChanges={hasUnsavedChanges}
                onToggleEditMode={toggleEditMode}
                onSaveChanges={saveChanges}
                onCancelChanges={cancelChanges}
              />
            </div>
            
            {/* Mobile Filter Button (Sheet) */}
            <div className="sm:hidden mt-2 sm:mt-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9 w-full">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="p-4">
                  <SheetHeader>
                    <SheetTitle>Column Filters</SheetTitle>
                  </SheetHeader>
                  {hasActiveFilters && (
                    <div className="mt-2 mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">{activeFilterCount} filter aktif</Badge>
                      <Button size="sm" variant="ghost" className="h-7 sm:h-8 px-2 text-[10px] sm:text-xs" onClick={clearAllFilters}>Clear all</Button>
                    </div>
                  )}
                  <div className="mt-1 max-h-[65vh] overflow-y-auto pr-1">
                    <ColumnFilters
                      headers={headers}
                      uniqueValuesByColumn={uniqueValuesByColumn}
                      columnFilters={columnFilters}
                      onToggle={toggleColumnFilter}
                      onClear={clearColumnFilter}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters Inline */}
            <div className="hidden sm:block mt-2 sm:mt-3 md:mt-4 overflow-x-auto">
              <ColumnFilters
                headers={headers}
                uniqueValuesByColumn={uniqueValuesByColumn}
                columnFilters={columnFilters}
                onToggle={toggleColumnFilter}
                onClear={clearColumnFilter}
              />
            </div>
            {/* Date filters removed */}
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <DataTable 
        rows={filteredRows} 
        isEditMode={isEditMode}
        onUpdateCell={updateCell}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
      />

      {/* Empty/Loading State */}
      {rows.length === 0 && <EmptyState isLoading={isLoading} />}
    </div>
  );
}