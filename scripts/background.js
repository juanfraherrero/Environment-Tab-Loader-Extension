chrome.commands.onCommand.addListener((command) => {
  if (
    command === "open_work_environment" ||
    command === "reset_work_environment"
  ) {
    /*
      When user press Ctrl+Shift+0 or Ctrl+Shift+1
      display pop up to select env
    */
    displayPopUp(command);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "executeMainFunction") {
    /*
      recieve message from popUp when
      user selects the enviroment to load
    */
    try {
      executeMainFunction(request.selectedEnv, request.command);
      sendResponse({ success: true });
    } catch (e) {
      sendResponse({ success: false });
    }
  }
});

/**
  Displays pop up to ask user wich env to display
*/
function displayPopUp(command) {
  chrome.windows.create({
    url: chrome.runtime.getURL("popup.html?command=" + command),
    type: "popup",
    width: 400,
    height: 500,
  });
}

/**
  Executes the main functionality based in the env passed and the command

  @param selectedEnv The env slected by user
  @param command The command that started the flow (load tabs | close and load tabs)

 */
function executeMainFunction(selectedEnv, command) {
  if (!selectedEnv | !command) {
    console.error("executeMainFunction - Must recieve the env and the command");
    return;
  }

  // retrieve enviroments
  chrome.storage.sync.get(["environments"], (result) => {
    if (chrome.runtime.lastError) throw new Error("Error getting storage info");
    const environments = result.environments || {};
    const urls = environments[selectedEnv] || [];

    if (urls.length <= 0) {
      alert("Please add pages to your enviroment before open it");
      return;
    }

    if (command === "open_work_environment") {
      // create new window with tabs
      chrome.windows.create({ url: urls, type: "normal" });
    }

    if (command === "reset_work_environment") {
      chrome.tabs.query({}, (tabs) => {
        const tabIds = tabs.map((tab) => tab.id);
        // close all tabs
        chrome.tabs.remove(tabIds, () => {
          // create new window with tabs
          chrome.windows.create({ url: urls, type: "normal" });
        });
      });
    }
  });
}
