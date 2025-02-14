import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useWorkspace } from './use-workspace';
import type { Database } from '@/types/database.types';

type CustomerCompany = Database['public']['Tables']['customer_companies']['Row'];

export function useCompanies() {
  const { workspace } = useWorkspace();

  return useQuery({
    queryKey: ['companies', workspace?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_companies')
        .select('*')
        .eq('account_id', workspace?.id)
        .order('name');

      if (error) throw error;
      return data as CustomerCompany[];
    },
    enabled: !!workspace?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
} 