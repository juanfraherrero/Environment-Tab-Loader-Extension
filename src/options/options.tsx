import { ChevronLeft, Settings } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

import { useSelectedEnv } from './hooks/useSelectedEnv';
import SelectEnvironmentSection from './subComponents/SelectEnvironmentSection';
import TabsForEnvironmentSection from './subComponents/TabsForEnvironmentSection';
import { Environments } from '../types/Environment';
import AddEnvironmentSection from './subComponents/AddEnviromentsSection';
import { HelpPopOver } from './subComponents/HelpPopover';
import { ListOfEnvs } from './subComponents/ListOfEnvs';
import { View } from './types/View';

export function OptionsPage(): JSX.Element {
  const [view, setView] = useState<View>(View.Main); // manage views with state

  const [environments, setEnvironments] = useState<Environments>({});
  const { selectedEnv, setSelectedEnv } = useSelectedEnv();
  const [newPageUrl, setNewPageUrl] = useState<string>('');
  const [pages, setPages] = useState<string[]>([]);

  const { toast } = useToast();
  const { t } = useTranslation();

  /**
   * Load tabs from the environment passed
   */
  const loadPages = useCallback(
    (env: string | null) => {
      let loadedPages: string[];
      if (env) {
        loadedPages = environments[env] || [];
      } else {
        loadedPages = [];
      }
      setPages(loadedPages);
    },
    [environments],
  );

  /**
   * Load all envs from storage and set first env
   */
  const loadAll = useCallback(() => {
    chrome.storage.sync.get(['environments'], result => {
      const loadedEnvs = result.environments || ({} as Environments);
      setEnvironments(loadedEnvs);
    });
  }, []);

  /**
   * Adds new env
   */
  const handleAddEnvironment = useCallback(
    (envName: string, onSuccess: () => void) => {
      if (!envName) return;

      // Get envs in loweCase
      const envs = Object.keys(environments).map(e => e.toLowerCase());

      if (envs.length >= 9) {
        // alert("Max quantity of environments is 9");
        toast({
          title: t('error.max_quantity'),
        });
        return;
      }
      if (envs.includes(envName.toLowerCase())) {
        // alert("Environment " + envName + " already exists");
        toast({
          title: t('error.env_already_exist', { env: envName }),
        });
        return;
      }

      // update env in storage
      const updatedEnvs = { ...environments, [envName]: [] } as Environments;
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        // loadEnvironments(); // do not fetch to storage
        if (chrome.runtime.lastError) {
          // alert("Error while creating new environment. Contact with creator!");
          toast({
            variant: 'destructive',
            title: t('error.create_new_env'),
          });
          return;
        }
        // Update local state
        setEnvironments(updatedEnvs);
        onSuccess();
      });
    },
    [environments, toast, t],
  );

  /**
   * Deletes selected environment
   */
  const handleDeleteEnvironment = useCallback(
    (envToDelete: string) => {
      if (envToDelete) {
        const updatedEnvs = { ...environments };
        delete updatedEnvs[envToDelete];

        chrome.storage.sync.set({ environments: updatedEnvs }, () => {
          // loadEnvironments(); // do not fetch to storage
          if (chrome.runtime.lastError) {
            // alert("Error while deleting environment. Contact with creator!");
            toast({
              variant: 'destructive',
              title: t('error.delete_new_env'),
            });
            return;
          }
          // Update local state
          setEnvironments(updatedEnvs);

          // if deleting the same env as selected set it to null
          if (selectedEnv === envToDelete) setSelectedEnv(null);
        });
      }
    },
    [environments, toast, t, selectedEnv, setSelectedEnv],
  );

  // --- Pages Functions

  /**
   * Adds tab to environment selected
   */
  const handleAddPage = (): void => {
    if (newPageUrl && selectedEnv) {
      if (environments[selectedEnv].includes(newPageUrl)) {
        toast({
          title: t('alert.env_already_exist'),
        });
        return;
      }

      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      updatedEnvs[selectedEnv].push(newPageUrl);
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        if (chrome.runtime.lastError) {
          // alert("Error while adding tab to environment. Contact with creator!");
          toast({
            variant: 'destructive',
            title: t('error.add_new_tab'),
          });
          return;
        }
        setNewPageUrl('');
        setEnvironments(updatedEnvs);
      });
    }
  };

  /**
   * Deletes tab from environment selected
   */
  const handleDeletePage = (urlToDelete: string): void => {
    if (urlToDelete && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      updatedEnvs[selectedEnv] = updatedEnvs[selectedEnv].filter(
        urlEnv => urlEnv !== urlToDelete,
      );
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        if (chrome.runtime.lastError) {
          toast({
            variant: 'destructive',
            title: t('error.delete_tab'),
          });
          return;
        }
        setEnvironments(updatedEnvs);
      });
    }
  };

  /**
   * Update tab from environment selected
   */
  const handleEditPage = (urlToEdit: string, oldUrl: string): void => {
    if (urlToEdit && oldUrl && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render

      updatedEnvs[selectedEnv] = updatedEnvs[selectedEnv].map(urlEnv => {
        // change old url for new
        if (urlEnv === oldUrl) {
          return urlToEdit;
        }
        return urlEnv;
      });

      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        if (chrome.runtime.lastError) {
          toast({
            variant: 'destructive',
            title: t('error.update_tab'),
          });
          return;
        }
        setEnvironments(updatedEnvs);
      });
    }
  };

  /**
   * The env selected change so update state for selectedEnv and load new selectedEnv's tabs
   */
  const handleChangeEnvironment = (envSelected: string): void => {
    setSelectedEnv(envSelected);
  };

  /**
   * When the selected env change reload his tabs
   */
  useEffect(() => {
    loadPages(selectedEnv);
  }, [loadPages, selectedEnv]); // TODO

  /**
   * Load all data when mount
   */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (view === View.Settings)
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 left-0 ml-1 h-9 w-9 mt-1 "
          onClick={() => setView(View.Main)}
        >
          <ChevronLeft className="h-[1.2rem] w-[1.2rem]" />
        </Button>

        <h1 className="text-center mt-10 mb-10 scroll-m-20 text-2xl font-semibold italic tracking-tight">
          {t('titleSettings')}
        </h1>

        <AddEnvironmentSection handleAddEnvironment={handleAddEnvironment} />

        <ListOfEnvs
          envs={Object.keys(environments)}
          onDeleteEnv={handleDeleteEnvironment}
        />

        <Toaster />
      </>
    );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-0 left-0 ml-1 h-9 w-9 mt-1"
        onClick={() => setView(View.Settings)}
      >
        <Settings className="h-[1.2rem] w-[1.2rem]" />
      </Button>

      <HelpPopOver />

      <h1 className="text-center mt-10 mb-10 scroll-m-20 text-2xl font-semibold italic tracking-tight">
        {t('title')}
      </h1>

      <SelectEnvironmentSection
        environments={environments}
        selectedEnv={selectedEnv}
        handleChangeEnvironment={handleChangeEnvironment}
        handleOpenSettings={() => {
          setView(View.Settings);
        }}
      />

      <TabsForEnvironmentSection
        newPageUrl={newPageUrl}
        setNewPageUrl={setNewPageUrl}
        handleAddPage={handleAddPage}
        handleDeletePage={handleDeletePage}
        handleEditPage={handleEditPage}
        pages={pages}
        isSelectedEnv={selectedEnv !== undefined && selectedEnv !== null}
      />

      <Toaster />
    </>
  );
}
