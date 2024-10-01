// Load all envs
document.addEventListener("DOMContentLoaded", () => {
  loadEnvironments();
});

// global variables
function $(id) {
  return document.getElementById(id);
}

// Elements definition
const createEnviromentButtonm = $("addEnvBtn");
const inputNewEnviromentName = $("newEnvName");
const inputNewURLPageName = $("newPageUrl");
const selectorEnvironment = $("envSelect");
const addPageButton = $("addPageBtn");
const deleteEnvironmentButton = $("deleteEnvBtn");

// Event listeners
createEnviromentButtonm.addEventListener("click", createEnviroment);
selectorEnvironment.addEventListener("change", onChangeSelectorEnviroment);
addPageButton.addEventListener("click", addURLPageToEnviroment);
deleteEnvironmentButton.addEventListener("click", deleteEnvironment);

/**
 * creates new enviroment
 */
function createEnviroment() {
  const newEnvName = inputNewEnviromentName.value.trim();
  if (newEnvName) {
    chrome.storage.sync.get(["environments"], (result) => {
      const environments = result.environments || {};
      if (Object.keys(environments).length >= 9) {
        alert("Max quantity of enviroments is 9");
        return;
      }
      environments[newEnvName] = [];
      chrome.storage.sync.set({ environments }, () => {
        loadEnvironments();
        inputNewEnviromentName.value = "";
      });
    });
  }
}

/**
 * When users select enviroment
 */
function onChangeSelectorEnviroment() {
  loadPages(selectorEnvironment.value);
}

/**
 * Add URL to enviroment selected
 */
function addURLPageToEnviroment() {
  const newPageUrl = inputNewURLPageName.value.trim();

  if (newPageUrl) {
    chrome.storage.sync.get(["environments"], (result) => {
      const environments = result.environments || {};
      const pagesURl = environments[selectorEnvironment.value];
      if (pagesURl) {
        pagesURl.push(newPageUrl);
        chrome.storage.sync.set({ environments }, () => {
          loadPages(selectorEnvironment.value);
          inputNewURLPageName.value = "";
        });
      }
    });
  }
}

/**
 * Deletes enviroment, but first verify with user
 */
function deleteEnvironment() {
  const isConfirmed = confirm(
    `Are you sure to delete environment "${selectorEnvironment.value}"?`
  );

  if (isConfirmed) {
    chrome.storage.sync.get(["environments"], (result) => {
      const environments = result.environments || {};
      if (environments[selectorEnvironment.value]) {
        delete environments[selectorEnvironment.value];
        chrome.storage.sync.set({ environments }, () => {
          loadEnvironments();
        });
      }
    });
  }
}

/**
 * Load all enviroments created
 */
function loadEnvironments() {
  chrome.storage.sync.get(["environments"], (result) => {
    const environments = result.environments || {};
    const selectedEnv = Object.keys(environments)[0] || "";

    selectorEnvironment.innerHTML = "";

    for (const env in environments) {
      const option = document.createElement("option");
      option.value = env;
      option.textContent = env;
      if (env === selectedEnv) {
        option.selected = true;
      }
      selectorEnvironment.appendChild(option);
    }

    if (selectedEnv) {
      loadPages(selectedEnv);
    }
  });
}

/**
 * Load pages from env passed
 *
 * @param {String} envName name of the enviroment currently selected
 *
 */
function loadPages(envName) {
  chrome.storage.sync.get(["environments"], (result) => {
    const environments = result.environments || {};
    const pages = environments[envName] || [];

    const pagesList = document.getElementById("pagesList");
    pagesList.innerHTML = "";

    pages.forEach((page) => {
      const li = document.createElement("li");
      li.textContent = page;
      pagesList.appendChild(li);
    });
  });
}
