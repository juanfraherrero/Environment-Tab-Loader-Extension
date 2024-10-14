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

  // Load environments when the component is mounted
  useEffect(() => {
    if (selectedEnv) loadPages(selectedEnv);
  }, [loadPages, selectedEnv]);

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
      if (environments[selectedEnv].find((tabUrl) => newPageUrl === tabUrl)) {
        alert("Url already exists in environment");
        return;
      }
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      updatedEnvs[selectedEnv].push(newPageUrl);
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        setNewPageUrl('');
        loadPages(selectedEnv);
      });
    }
  };
  const handleDeletePage = (urlToDelete: string) => {
    console.log(urlToDelete);
    console.log(selectedEnv);
    if (urlToDelete && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      console.log(updatedEnvs[selectedEnv])
      updatedEnvs[selectedEnv] = updatedEnvs[selectedEnv].filter((urlEnv) => urlEnv !== urlToDelete)
      console.log(updatedEnvs[selectedEnv])
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        loadPages(selectedEnv);
      });
    }
  };
  const handleEditPage = (urlToEdit: string, newUrl: string) => {
    console.log(urlToEdit);
    console.log(selectedEnv);

    if (urlToEdit && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render

      console.log(updatedEnvs[selectedEnv]);

      updatedEnvs[selectedEnv] = updatedEnvs[selectedEnv].map((urlEnv) => {
        if (urlEnv === urlToEdit) {
          return newUrl
        }
        return urlEnv
      })
      console.log(updatedEnvs[selectedEnv]);

      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
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
      <h1
        className='text-center mt-3 mb-5 scroll-m-20 text-2xl font-extrabold tracking-tight'
      >
        Configure Environments
      </h1>

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
          handleDeletePage={handleDeletePage}
          handleEditPage={handleEditPage}
          pages={pages}

        />
      )}
    </div>
  );
};