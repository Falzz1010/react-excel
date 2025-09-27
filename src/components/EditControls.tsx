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
    <div className="flex items-center gap-3">
      {hasUnsavedChanges && (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Unsaved changes
        </Badge>
      )}
      
      {!isEditMode ? (
        <Button
          onClick={onToggleEditMode}
          className="bg-gradient-primary hover:opacity-90 transition-smooth"
          size="sm"
        >
          <Edit className="h-3 w-3 mr-1.5" />
          Edit Table
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={onSaveChanges}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-3 w-3 mr-1.5" />
            Save Changes
          </Button>
          <Button
            onClick={onCancelChanges}
            variant="outline"
            size="sm"
          >
            <X className="h-3 w-3 mr-1.5" />
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}


