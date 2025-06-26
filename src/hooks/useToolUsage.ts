import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useToolUsage = (toolId: string) => {
  const { user } = useAuth();
  const [usageCount, setUsageCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Generate session ID for anonymous users
  const getSessionId = () => {
    const existingId = localStorage.getItem('tool_session_id');
    if (existingId) return existingId;
    
    const newId = crypto.randomUUID();
    localStorage.setItem('tool_session_id', newId);
    return newId;
  };

  const checkUsage = useCallback(async () => {
    setLoading(true);
    try {
      if (user) {
        // For authenticated users
        const { data, error } = await supabase
          .from('tool_usage')
          .select('usage_count')
          .eq('user_id', user.id)
          .eq('tool_id', toolId)
          .maybeSingle();

        if (error) throw error;
        
        const count = data?.usage_count || 0;
        setUsageCount(count);
        setIsBlocked(false); // Authenticated users are never blocked
      } else {
        // For anonymous users
        const sessionId = getSessionId();
        const { data, error } = await supabase
          .from('tool_usage')
          .select('usage_count')
          .eq('session_id', sessionId)
          .eq('tool_id', toolId)
          .is('user_id', null)
          .maybeSingle();

        if (error) throw error;
        
        const count = data?.usage_count || 0;
        setUsageCount(count);
        setIsBlocked(count >= 10);
      }
    } catch (error) {
      console.error('Error checking usage:', error);
    } finally {
      setLoading(false);
    }
  }, [user, toolId]);

  useEffect(() => {
    checkUsage();
  }, [checkUsage, toolId, user]);

  const incrementUsage = async () => {
    if (user) {
      // For authenticated users
      const { data, error } = await supabase
        .from('tool_usage')
        .upsert({
          user_id: user.id,
          tool_id: toolId,
          usage_count: usageCount + 1,
          last_used_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,tool_id',
        })
        .select()
        .single();

      if (error) throw error;
      setUsageCount(data.usage_count);
    } else {
      // For anonymous users
      const sessionId = getSessionId();
      const newCount = usageCount + 1;
      
      const { error } = await supabase
        .from('tool_usage')
        .upsert({
          session_id: sessionId,
          tool_id: toolId,
          usage_count: newCount,
          last_used_at: new Date().toISOString(),
        }, {
          onConflict: 'session_id,tool_id',
        });

      if (error) throw error;
      
      setUsageCount(newCount);
      setIsBlocked(newCount >= 10);
    }
  };

  return {
    usageCount,
    isBlocked,
    loading,
    incrementUsage,
    checkUsage,
  };
};
