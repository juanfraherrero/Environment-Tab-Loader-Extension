import { useCallback, useEffect, useState } from "react";
import TabsForEnvironmentSection from "./subComponents/TabsForEnvironmentSection";
import SelectEnvironmentSection from "./subComponents/SelectEnvironmentSection";
import { Environments } from "../types/Environment";
import AddEnvironmentSection from "./subComponents/AddEnviromentsSection";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function OptionsPage() {
  const [environments, setEnvironments] = useState<Environments>({});
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [newPageUrl, setNewPageUrl] = useState<string>("");
  const [pages, setPages] = useState<string[]>([]);
  const { toast } = useToast();

  /**
   * Load tabs from the environment passed
   */
  const loadPages = useCallback(
    (env: string) => {
      let loadedPages: string[];
      if (env) {
        loadedPages = environments[env] || [];
      } else {
        loadedPages = [];
      }
      setPages(loadedPages);
    },
    [environments]
  );

  /**
   * Load all envs from storage and set first env
   */
  const loadAll = useCallback(() => {
    chrome.storage.sync.get(["environments"], (result) => {
      const loadedEnvs = result.environments || ({} as Environments);
      setEnvironments(loadedEnvs);

      const firstEnv = Object.keys(loadedEnvs).sort()[0];
      setSelectedEnv(firstEnv);
    });
  }, []);

  /**
   * Adds new env
   */
  const handleAddEnvironment = useCallback(
    (envName: string) => {
      if (!envName) return;

      // Get envs in loweCase
      const envs = Object.keys(environments).map((e) => e.toLowerCase());

      if (envs.length >= 9) {
        // alert("Max quantity of environments is 9");
        toast({
          title: "Max quantity of environments is 9",
        });
        return;
      }
      if (envs.includes(envName.toLowerCase())) {
        // alert("Environment " + envName + " already exists");
        toast({
          title: "Environment " + envName + " already exists",
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
            variant: "destructive",
            title:
              "Error while creating new environment. Contact with creator!",
          });
          return;
        }
        // Update local state
        setEnvironments(updatedEnvs);
      });
    },
    [environments, toast]
  );

  /**
   * Deletes selected environment
   */
  const handleDeleteEnvironment = useCallback(() => {
    if (
      selectedEnv &&
      confirm(`Are you sure to delete environment "${selectedEnv}"?`)
    ) {
      const updatedEnvs = { ...environments };
      delete updatedEnvs[selectedEnv];

      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        // loadEnvironments(); // do not fetch to storage
        if (chrome.runtime.lastError) {
          // alert("Error while deleting environment. Contact with creator!");
          toast({
            variant: "destructive",
            title: "Error while deleting environment. Contact with creator!",
          });
          return;
        }
        // Update local state
        setEnvironments(updatedEnvs);

        // As env was deleted set first env if exist else null
        const firstEnv = Object.keys(updatedEnvs).sort()[0];
        if (firstEnv) {
          setSelectedEnv(firstEnv);
        } else {
          setSelectedEnv(null);
        }
      });
    }
  }, [environments, selectedEnv, toast]);

  // --- Pages Functions

  /**
   * Adds tab to environment selected
   */
  const handleAddPage = () => {
    if (newPageUrl && selectedEnv) {
      if (environments[selectedEnv].includes(newPageUrl)) {
        // alert("Url already exists in environment");
        toast({
          title: "Url already exists in environment",
        });
        return;
      }

      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      updatedEnvs[selectedEnv].push(newPageUrl);
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        if (chrome.runtime.lastError) {
          // alert("Error while adding tab to environment. Contact with creator!");
          toast({
            variant: "destructive",
            title:
              "Error while adding tab to environment. Contact with creator!",
          });
          return;
        }
        setNewPageUrl("");
        setEnvironments(updatedEnvs);
      });
    }
  };

  /**
   * Deletes tab from environment selected
   */
  const handleDeletePage = (urlToDelete: string) => {
    if (urlToDelete && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render
      updatedEnvs[selectedEnv] = updatedEnvs[selectedEnv].filter(
        (urlEnv) => urlEnv !== urlToDelete
      );
      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        if (chrome.runtime.lastError) {
          // alert(
          //   "Error while deleting tab from environment. Contact with creator!"
          // );
          toast({
            variant: "destructive",
            title:
              "Error while deleting tab from environment. Contact with creator!",
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
  const handleEditPage = (urlToEdit: string, oldUrl: string) => {
    if (urlToEdit && oldUrl && selectedEnv) {
      const updatedEnvs = { ...environments }; // shallow copy to change ref and re-render

      updatedEnvs[selectedEnv] = updatedEnvs[selectedEnv].map((urlEnv) => {
        // change old url for new
        if (urlEnv === oldUrl) {
          return urlToEdit;
        }
        return urlEnv;
      });

      chrome.storage.sync.set({ environments: updatedEnvs }, () => {
        if (chrome.runtime.lastError) {
          // alert(
          //   "Error while updating tab from environment. Contact with creator!"
          // );
          toast({
            variant: "destructive",
            title:
              "Error while updating tab from environment. Contact with creator!",
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
  const handleChangeEnvironment = (envSelected: string) => {
    setSelectedEnv(envSelected);
  };

  /**
   * When the selected env change reload his tabs
   */
  useEffect(() => {
    if (selectedEnv) loadPages(selectedEnv);
  }, [loadPages, selectedEnv]); // TODO

  /**
   * Load all data when mount
   */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div>
      <h1 className="text-center mt-3 mb-5 scroll-m-20 text-2xl font-extrabold tracking-tight">
        Configure Environments
      </h1>

      <AddEnvironmentSection handleAddEnvironment={handleAddEnvironment} />

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
      <Toaster />
    </div>
  );
}
