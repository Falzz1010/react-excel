import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface SearchControlsProps {
  searchTerm: string;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
}

export function SearchControls({ 
  searchTerm, 
  filteredCount, 
  totalCount, 
  onSearchChange 
}: SearchControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center w-full overflow-x-auto">
      <div className="relative flex-1 min-w-0 rounded-md bg-background ring-1 ring-input ring-offset-0 hover:ring-primary/60 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ring-offset-background transition">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search in table..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 text-sm bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
      </div>
      <Badge variant="outline" className="whitespace-nowrap text-xs">
        {filteredCount} of {totalCount} rows
      </Badge>
    </div>
  );
}