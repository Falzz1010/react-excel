import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";

interface EmptyStateProps {
  isLoading: boolean;
}

export function EmptyState({ isLoading }: EmptyStateProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="py-8 sm:py-12">
          <div className="text-center space-y-4">
            <div className="animate-spin mx-auto w-6 h-6 sm:w-8 sm:h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-muted-foreground text-sm">Processing your file...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 border-dashed border-2 border-muted-foreground/20">
      <CardContent className="py-8 sm:py-12">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
            <FileSpreadsheet className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No data uploaded yet</h3>
            <p className="text-muted-foreground text-sm">
              Upload an Excel or CSV file to start viewing and managing your data
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}