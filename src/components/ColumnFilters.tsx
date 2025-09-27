import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface ColumnFiltersProps {
  headers: any[];
  uniqueValuesByColumn: Record<number, string[]>;
  columnFilters: Record<number, Set<string>>;
  onToggle: (columnIndex: number, value: string) => void;
  onClear: (columnIndex: number) => void;
}

export function ColumnFilters({ headers, uniqueValuesByColumn, columnFilters, onToggle, onClear }: ColumnFiltersProps) {
  if (!headers || headers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 overflow-x-hidden">
      {headers.map((h, idx) => (
        <DropdownMenu key={idx}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs whitespace-nowrap">
              {String(h || `Column ${idx + 1}`)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter {String(h || `Column ${idx + 1}`)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ColumnFilterMenu
              columnIndex={idx}
              values={uniqueValuesByColumn[idx] || []}
              selected={columnFilters[idx]}
              onToggle={onToggle}
              onClear={onClear}
            />
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <Button variant="ghost" size="sm" className="w-full" onClick={() => onClear(idx)}>
                Clear filter
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </div>
  );
}


interface ColumnFilterMenuProps {
  columnIndex: number;
  values: string[];
  selected?: Set<string>;
  onToggle: (columnIndex: number, value: string) => void;
  onClear: (columnIndex: number) => void;
}

function ColumnFilterMenu({ columnIndex, values, selected, onToggle, onClear }: ColumnFilterMenuProps) {
  const [query, setQuery] = useState<string>("");

  const normalizedValues = useMemo(() => values.map(v => (v == null ? "" : String(v))), [values]);

  const filteredValues = useMemo(() => {
    if (!query) return normalizedValues;
    const q = query.toLowerCase();
    return normalizedValues.filter(v => (v || "").toLowerCase().includes(q));
  }, [normalizedValues, query]);

  const isAllSelected = useMemo(() => {
    if (!selected || selected.size === 0) return false;
    // when all unique values are selected
    return normalizedValues.every(v => selected.has(v));
  }, [normalizedValues, selected]);

  const handleSelectAll = () => {
    // Select all shown values
    for (const v of filteredValues) onToggle(columnIndex, v);
  };

  const handleClearAll = () => {
    onClear(columnIndex);
  };

  return (
    <div className="px-2 py-2">
      <div className="mb-2">
        <Input
          placeholder="Search values..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Button variant="secondary" size="sm" className="h-7 px-2 text-xs" onClick={handleSelectAll}>
          Select all
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleClearAll}>
          Clear all
        </Button>
      </div>
      <div className="max-h-60 overflow-auto px-1 py-1">
        {filteredValues.map((val) => {
          const isChecked = selected?.has(val) ?? false;
          return (
            <DropdownMenuCheckboxItem key={val || "(empty)"} checked={isChecked} onCheckedChange={() => onToggle(columnIndex, val)}>
              <div className="flex items-center gap-2">
                <Checkbox checked={isChecked} />
                <span className="truncate max-w-[160px]" title={val || "(empty)"}>
                  {val === "" ? "(empty)" : val}
                </span>
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
        {filteredValues.length === 0 && (
          <div className="text-xs text-muted-foreground px-2 py-1">No values</div>
        )}
      </div>
    </div>
  );
}


