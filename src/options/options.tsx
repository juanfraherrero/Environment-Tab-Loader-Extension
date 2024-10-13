import { useCallback, useEffect, useState } from 'react';
import TabsForEnvironmentSection from './subComponents/TabsForEnvironmentSection';
import SelectEnvironmentSection from './subComponents/SelectEnvironmentSection';
import { Environments } from '../types/Environment';
import AddEnvironmentSection from './subComponents/AddEnviromentsSection';

export default function OptionsPage() {
  const [environments, setEnvironments] = useState<Environments>({});
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [newPageUrl, setNewPageUrl] = useState<string>('');
  const [pages, setPages] = useState<string[]>([]);

  const loadPages = useCallback((env: string) => {
    let loadedPages: string[]
    if (env) {
      loadedPages = environments[env] || []
    } else {
      loadedPages = []
    };
    setPages(loadedPages);
  }, [environments]);

  const loadEnvironments = useCallback(() => {
    chrome.storage.sync.get(['environments'], (result) => {
      const loadedEnvs = result.environments || {} as Environments;
      setEnvironments(loadedEnvs);

      const firstEnv = Object.keys(loadedEnvs).sort()[0];
      setSelectedEnv(firstEnv);
      loadPages(firstEnv);
    });
  }, [loadPages]);

  // Load environments when the component is mounted
  useEffect(() => {
    loadEnvironments();
  }, []);

  const handleAddEnvironment = useCallback((envName: string) => {
    if (envName) {
      if (Object.keys(environments).length < 9) {
        const updatedEnvs = { ...environments, [envName]: [] } as Environments;
        chrome.storage.sync.set({ environments: updatedEnvs }, () => {
          loadEnvironments();
        });
      } else {
        alert('Max quantity of environments is 9');
      }
    }
  }, [environments, loadEnvironments]);

  const handleDeleteEnvironment = () => {
    if (selectedEnv && confirm(`Are you sure to delete environment "${selectedEnv}"?`)) {
      const updatedEnvs = { ...environments };
      delete updatedEnvs[selectedEnv];
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        loadEnvironments();
      });
    }
  };

  const handleAddPage = () => {
    if (newPageUrl && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      updatedEnvs[selectedEnv].push(newPageUrl);
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        setNewPageUrl('');
        loadPages(selectedEnv);
      });
    }
  };

  const handleChangeEnvironment = (envSelected: string) => {
    setSelectedEnv(envSelected);
    loadPages(envSelected);
  };

  return (
    <div>
      <h1>Configure Environments</h1>

      <AddEnvironmentSection
        handleAddEnvironment={handleAddEnvironment}
      />

      <SelectEnvironmentSection
        environments={environments}
        selectedEnv={selectedEnv}
        handleChangeEnvironment={handleChangeEnvironment}
        handleDeleteEnvironment={handleDeleteEnvironment}
      />

      {selectedEnv && (
        <TabsForEnvironmentSection
          newPageUrl={newPageUrl}
          setNewPageUrl={setNewPageUrl}
          handleAddPage={handleAddPage}
          pages={pages}
        />
      )}
    </div>
  );
};