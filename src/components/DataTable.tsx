import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Check, X } from "lucide-react";
import { Maximize2 } from "lucide-react";

interface DataTableProps {
  rows: any[][];
  isEditMode?: boolean;
  onUpdateCell?: (rowIndex: number, colIndex: number, value: any) => void;
  onAddRow?: (afterIndex?: number) => void;
  onDeleteRow?: (rowIndex: number) => void;
}

export function DataTable({ 
  rows, 
  isEditMode = false, 
  onUpdateCell, 
  onAddRow, 
  onDeleteRow 
}: DataTableProps) {
  const [editingCell, setEditingCell] = useState<{row: number, col: number} | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  if (rows.length === 0) return null;

  // Performance optimization: limit visible rows for large datasets
  const maxVisibleRows = 1000;
  const displayRows = rows.length > maxVisibleRows ? rows.slice(0, maxVisibleRows) : rows;
  const hasMoreRows = rows.length > maxVisibleRows;

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (!isEditMode || rowIndex === 0) return; // Don't edit header row
    
    setEditingCell({ row: rowIndex, col: colIndex });
    setEditValue(rows[rowIndex]?.[colIndex]?.toString() || "");
  };

  const handleCellSave = () => {
    if (editingCell && onUpdateCell) {
      onUpdateCell(editingCell.row, editingCell.col, editValue);
    }
    setEditingCell(null);
    setEditValue("");
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCellSave();
    } else if (e.key === 'Escape') {
      handleCellCancel();
    }
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center justify-end px-3 py-2 border-b">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-2">
                <Maximize2 className="h-4 w-4" />
                Perbesar
              </Button>
            </DialogTrigger>
            <DialogContent className="w-screen h-screen max-w-none p-0 sm:p-2">
              <DialogHeader className="px-3 pt-3">
                <DialogTitle className="text-base">Tabel</DialogTitle>
              </DialogHeader>
              <div className="h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-full overflow-auto">
                <div className="min-w-max">
                  <table className="w-full min-w-max">
                    <thead className="bg-gradient-secondary sticky top-0 z-10">
                      <tr>
                        {(displayRows[0] || []).map((cell, j) => (
                          <th
                            key={`mh-${j}`}
                            className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm border-r border-border last:border-r-0 text-left whitespace-nowrap"
                            title={cell?.toString() || ""}
                          >
                            <div className="min-w-[120px] sm:min-w-[160px]">{cell || ""}</div>
                          </th>
                        ))}
                        {isEditMode && (
                          <th className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm text-center min-w-[100px]">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.slice(1).map((row, i) => (
                        <tr key={`m-${i}`} className="hover:bg-accent/50 border-b border-border transition-smooth">
                          {row.map((cell, j) => (
                            <td key={`m-${i}-${j}`} className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm border-r border-border last:border-r-0 whitespace-nowrap">
                              {editingCell?.row === i + 1 && editingCell?.col === j ? (
                                <div className="min-w-[120px] sm:min-w-[160px] flex items-center gap-1">
                                  <Input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="h-8 text-[11px]"
                                    autoFocus
                                    aria-label={`Edit cell ${i + 1}, ${j + 1}`}
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={handleCellSave}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0"
                                    onClick={handleCellCancel}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div
                                  className="min-w-[120px] sm:min-w-[160px] truncate cursor-pointer hover:bg-accent/30 p-1 rounded"
                                  onClick={() => handleCellClick(i + 1, j)}
                                  title={isEditMode ? "Click to edit" : cell?.toString() || ""}
                                >
                                  {cell || ""}
                                </div>
                              )}
                            </td>
                          ))}
                          {isEditMode && (
                            <td className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm text-center min-w-[100px]">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                                  onClick={() => onAddRow?.(i + 1)}
                                  title="Add row below"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => onDeleteRow?.(i + 1)}
                                  title="Delete row"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                      {isEditMode && (
                        <tr className="border-b border-border">
                          <td colSpan={rows[0]?.length || 0} className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => onAddRow?.()}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Row
                            </Button>
                          </td>
                          <td className="px-2 sm:px-3 py-2 sm:py-3"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {hasMoreRows && (
          <div className="p-3 bg-muted/30 border-b">
            <p className="text-xs text-muted-foreground text-center">
              Menampilkan {maxVisibleRows} dari {rows.length} baris. Gunakan filter untuk melihat data spesifik.
            </p>
          </div>
        )}
        <div className="overflow-auto max-h-[60vh] w-full scroll-smooth [scrollbar-gutter:stable]">
          <table className="w-full min-w-max">
            <thead className="bg-gradient-secondary sticky top-0 z-10">
              <tr>
                {(displayRows[0] || []).map((cell, j) => (
                  <th
                    key={`h-${j}`}
                    className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm border-r border-border last:border-r-0 text-left whitespace-nowrap"
                    title={cell?.toString() || ""}
                  >
                    <div className="min-w-[100px] sm:min-w-[140px]">{cell || ""}</div>
                  </th>
                ))}
                {isEditMode && (
                  <th className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm text-center min-w-[90px]">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {displayRows.slice(1).map((row, i) => (
                <tr key={i} className="hover:bg-accent/50 border-b border-border transition-smooth">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm border-r border-border last:border-r-0 whitespace-nowrap"
                    >
                      {editingCell?.row === i + 1 && editingCell?.col === j ? (
                        <div className="min-w-[100px] sm:min-w-[140px] flex items-center gap-1">
                          <Input
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-8 text-[11px]"
                            autoFocus
                            aria-label={`Edit cell ${i + 1}, ${j + 1}`}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={handleCellSave}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={handleCellCancel}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div 
                          className="min-w-[100px] sm:min-w-[140px] truncate cursor-pointer hover:bg-accent/30 p-1 rounded"
                          onClick={() => handleCellClick(i + 1, j)}
                          title={isEditMode ? "Click to edit" : cell?.toString() || ""}
                        >
                          {cell || ""}
                        </div>
                      )}
                    </td>
                  ))}
                  {isEditMode && (
                    <td className="px-2 sm:px-3 py-2 sm:py-3 text-[11px] sm:text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                          onClick={() => onAddRow?.(i + 1)}
                          title="Add row below"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          onClick={() => onDeleteRow?.(i + 1)}
                          title="Delete row"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {isEditMode && (
                <tr className="border-b border-border">
                  <td colSpan={rows[0]?.length || 0} className="px-2 sm:px-3 py-2 sm:py-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => onAddRow?.()}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Row
                    </Button>
                  </td>
                  <td className="px-2 sm:px-3 py-2 sm:py-3"></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}