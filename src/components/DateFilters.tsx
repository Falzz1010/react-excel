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
    <div className="flex flex-wrap gap-3">
      {dateColumns.map((idx) => {
        const h = headers[idx];
        const range = dateFilters[idx] || {};
        return (
          <div key={idx} className="flex items-center gap-2">
            <div className="text-xs font-medium w-28 truncate" title={String(h || `Column ${idx + 1}`)}>
              {String(h || `Column ${idx + 1}`)}
            </div>
            <Input
              type="date"
              value={range.from || ""}
              onChange={(e) => onChange(idx, e.target.value || undefined, range.to)}
              className="h-8 px-2 text-xs w-36"
            />
            <span className="text-xs">to</span>
            <Input
              type="date"
              value={range.to || ""}
              onChange={(e) => onChange(idx, range.from, e.target.value || undefined)}
              className="h-8 px-2 text-xs w-36"
            />
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onClear(idx)}>
              Clear
            </Button>
          </div>
        );
      })}
    </div>
  );
}


