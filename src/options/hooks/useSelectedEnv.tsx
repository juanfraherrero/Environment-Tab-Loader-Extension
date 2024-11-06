import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useToast } from '@/hooks/use-toast';

interface useSelectedEnvReturn {
  selectedEnv: string | null;
  setSelectedEnv: (newEnv: string | null) => void;
}
/**
 * Hook to keep state of selected environment sync with chrome storage
 */
export function useSelectedEnv(): useSelectedEnvReturn {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Load initial value from chrome.storage on mount
  useEffect(() => {
    chrome.storage.sync.get('selectedEnv', result => {
      if (chrome.runtime.lastError) {
        toast({
          variant: 'destructive',
          title: t('error.loading_selected_env'),
        });
        return;
      }

      setSelectedEnv(result.selectedEnv || null);
    });
  }, [toast, t]);

  // Function to update both the state and chrome.storage
  const updateSelectedEnv = useCallback(
    (newEnv: string | null) => {
      setSelectedEnv(newEnv);
      chrome.storage.sync.set({ selectedEnv: newEnv }, () => {
        if (chrome.runtime.lastError) {
          toast({
            variant: 'destructive',
            title: t('error.saving_selected_env'),
          });
          return;
        }
      });
    },
    [t, toast],
  );

  return { selectedEnv, setSelectedEnv: updateSelectedEnv };
}
