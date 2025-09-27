import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useItems } from '@/hooks/useItems';
import { ItemForm } from '@/components/ItemForm';
import { ItemsList } from '@/components/ItemsList';

export default function Items() {
  const { items, loading, createItem, updateItem, deleteItem } = useItems();
  const [showForm, setShowForm] = useState(false);

  const handleCreate = async (data: { title: string; description?: string }) => {
    const result = await createItem(data.title, data.description);
    if (result.data) {
      setShowForm(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Item</h1>
          <p className="text-muted-foreground">Kelola semua item Anda di sini</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Tutup Form' : 'Tambah Item'}
        </Button>
      </div>

      <Separator />

      {showForm && (
        <div className="space-y-6">
          <ItemForm onSubmit={handleCreate} />
          <Separator />
        </div>
      )}

      <ItemsList
        items={items}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
    </div>
  );
}