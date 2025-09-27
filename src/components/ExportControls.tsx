import React from "react";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface ExportControlsProps {
  onExportExcel: () => void;
  onExportCSV: () => void;
  onClear: () => void;
}

export function ExportControls({ onExportExcel, onExportCSV, onClear }: ExportControlsProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
      <Button 
        onClick={onExportExcel} 
        className="bg-gradient-primary hover:opacity-90 transition-smooth text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
        size="sm"
      >
        <Download className="h-3 w-3 mr-1 sm:mr-1.5" />
        Excel
      </Button>
      <Button 
        onClick={onExportCSV} 
        variant="outline"
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
      >
        <Download className="h-3 w-3 mr-1 sm:mr-1.5" />
        CSV
      </Button>
      <Button 
        onClick={onClear} 
        variant="outline"
        size="sm"
        className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
      >
        <X className="h-3 w-3 mr-1 sm:mr-1.5" />
        Clear
      </Button>
    </div>
  );
}