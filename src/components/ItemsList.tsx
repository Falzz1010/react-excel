import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Item } from '@/hooks/useItems';
import { ItemForm } from './ItemForm';

interface ItemsListProps {
  items: Item[];
  onUpdate: (id: string, data: Partial<Item>) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export function ItemsList({ items, onUpdate, onDelete }: ItemsListProps) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      archived: 'outline'
    } as const;
    
    const labels = {
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      archived: 'Arsip'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleUpdate = async (data: { title: string; description?: string; status?: string }) => {
    if (!editingItem) return;
    await onUpdate(editingItem.id, data);
    setEditingItem(null);
  };

  if (editingItem) {
    return (
      <ItemForm
        item={editingItem}
        onSubmit={handleUpdate}
        onCancel={() => setEditingItem(null)}
      />
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Belum ada item. Tambahkan item pertama Anda!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.description && (
                  <CardDescription className="mt-1">
                    {item.description}
                  </CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                {getStatusBadge(item.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingItem(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Item</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus item "{item.title}"? 
                        Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(item.id)}>
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}