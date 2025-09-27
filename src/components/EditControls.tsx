import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X, AlertCircle } from "lucide-react";

interface EditControlsProps {
  isEditMode: boolean;
  hasUnsavedChanges: boolean;
  onToggleEditMode: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
}

export function EditControls({
  isEditMode,
  hasUnsavedChanges,
  onToggleEditMode,
  onSaveChanges,
  onCancelChanges,
}: EditControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
      {hasUnsavedChanges && (
        <Badge variant="destructive" className="flex items-center gap-1 text-[10px] sm:text-xs">
          <AlertCircle className="h-3 w-3" />
          Unsaved changes
        </Badge>
      )}
      
      {!isEditMode ? (
        <Button
          onClick={onToggleEditMode}
          className="bg-gradient-primary hover:opacity-90 transition-smooth text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9 w-full sm:w-auto"
          size="sm"
        >
          <Edit className="h-3 w-3 mr-1 sm:mr-1.5" />
          Edit Table
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <Button
            onClick={onSaveChanges}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
            size="sm"
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-3 w-3 mr-1 sm:mr-1.5" />
            Save Changes
          </Button>
          <Button
            onClick={onCancelChanges}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
          >
            <X className="h-3 w-3 mr-1 sm:mr-1.5" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}


