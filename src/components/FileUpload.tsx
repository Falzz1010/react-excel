import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet } from "lucide-react";

interface FileUploadProps {
  fileName: string;
  isLoading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUpload({ fileName, isLoading, onFileUpload }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBrowseClick = () => inputRef.current?.click();

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isLoading) return;
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      // Reuse existing handler shape
      onFileUpload({ target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-gradient-secondary">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-5 w-5 text-primary" />
          Upload File
        </CardTitle>
        <CardDescription className="text-sm">
          Select Excel (.xlsx, .xls, .xlsm, .xlsb) or CSV files • Max 50MB
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={`rounded-lg border border-dashed transition-smooth ${
            isDragging ? "border-primary bg-primary/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="hidden">
                <Input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.ods"
                  onChange={onFileUpload}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleBrowseClick} disabled={isLoading} size="sm" className="bg-primary text-primary-foreground">
                Choose file
              </Button>
              <div className="text-xs text-muted-foreground">
                or drag & drop here
              </div>
            </div>
            {fileName && (
              <Badge variant="secondary" className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <FileSpreadsheet className="h-3 w-3" />
                <span className="text-xs truncate max-w-[220px] sm:max-w-[280px]" title={fileName}>{fileName}</span>
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}