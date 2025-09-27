import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Item {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (title: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([{ 
          title, 
          description: description || null,
          user_id: (await supabase.auth.getUser()).data.user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({
        title: 'Berhasil',
        description: 'Item berhasil ditambahkan'
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { data: null, error };
    }
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...data } : item
      ));
      
      toast({
        title: 'Berhasil',
        description: 'Item berhasil diperbarui'
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { data: null, error };
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Berhasil',
        description: 'Item berhasil dihapus'
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  };
}