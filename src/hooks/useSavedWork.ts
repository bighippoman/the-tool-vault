import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Json } from '@/integrations/supabase/types';

export interface SavedWork {
  id: string;
  title: string;
  content: Json;
  created_at: string;
  updated_at: string;
}

export const useSavedWork = (toolId: string) => {
  const { user } = useAuth();
  const [savedWorks, setSavedWorks] = useState<SavedWork[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedWorks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_work')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSavedWorks(data || []);
    } catch (error) {
      console.error('Error loading saved work:', error);
      setSavedWorks([]);
    } finally {
      setLoading(false);
    }
  }, [user, toolId]);

  useEffect(() => {
    if (user) {
      loadSavedWorks();
    } else {
      setSavedWorks([]);
      setLoading(false);
    }
  }, [toolId, user, loadSavedWorks]);

  const saveWork = async (title: string, content: Json) => {
    if (!user) throw new Error('Must be logged in to save work');

    const { data, error } = await supabase
      .from('saved_work')
      .insert({
        user_id: user.id,
        tool_id: toolId,
        title,
        content,
      })
      .select()
      .single();

    if (error) throw error;
    
    setSavedWorks(prev => [data, ...prev]);
    return data;
  };

  const updateWork = async (id: string, title: string, content: Json) => {
    if (!user) throw new Error('Must be logged in to update work');

    const { data, error } = await supabase
      .from('saved_work')
      .update({
        title,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    setSavedWorks(prev => prev.map(work => work.id === id ? data : work));
    return data;
  };

  const deleteWork = async (id: string) => {
    if (!user) throw new Error('Must be logged in to delete work');

    const { error } = await supabase
      .from('saved_work')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    
    setSavedWorks(prev => prev.filter(work => work.id !== id));
  };

  return {
    savedWorks,
    loading,
    saveWork,
    updateWork,
    deleteWork,
    loadSavedWorks,
  };
};
