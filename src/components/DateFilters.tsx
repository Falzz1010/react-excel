import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DateFiltersProps {
  headers: any[];
  dateColumns: number[];
  dateFilters: Record<number, { from?: string; to?: string }>;
  onChange: (columnIndex: number, from?: string, to?: string) => void;
  onClear: (columnIndex: number) => void;
}

export function DateFilters({ headers, dateColumns, dateFilters, onChange, onClear }: DateFiltersProps) {
  if (!dateColumns || dateColumns.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {dateColumns.map((idx) => {
        const h = headers[idx];
        const range = dateFilters[idx] || {};
        return (
          <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 w-full sm:w-auto">
            <div className="text-[10px] sm:text-xs font-medium w-20 sm:w-28 truncate" title={String(h || `Column ${idx + 1}`)}>
              {String(h || `Column ${idx + 1}`)}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
              <Input
                type="date"
                value={range.from || ""}
                onChange={(e) => onChange(idx, e.target.value || undefined, range.to)}
                className="h-7 sm:h-8 px-1 sm:px-2 text-[10px] sm:text-xs w-24 sm:w-36"
              />
              <span className="text-[10px] sm:text-xs">to</span>
              <Input
                type="date"
                value={range.to || ""}
                onChange={(e) => onChange(idx, range.from, e.target.value || undefined)}
                className="h-7 sm:h-8 px-1 sm:px-2 text-[10px] sm:text-xs w-24 sm:w-36"
              />
              <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-[10px] sm:text-xs px-2" onClick={() => onClear(idx)}>
                Clear
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}


