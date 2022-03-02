import "./style.css";
import { getTabList, setStorage } from "../utils/storage";

const $tabList = document.getElementById("tab-list");

chrome.tabs.getCurrent(async (currentTab) => {
  const { tabList } = await getTabList();
  const tabs = tabList[currentTab.windowId];

  makeList(tabs);
});

function makeList(tabs) {
  tabs.forEach((tabInfo, index) => {
    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";

    const tabCard = document.createElement("div");
    tabCard.className = "tab-card";
    tabCard.textContent =
      tabInfo.title.length > 50
        ? `${tabInfo.title.slice(0, 50)}...`
        : tabInfo.title;

    tabCard.addEventListener("click", () => {
      chrome.tabs.create({
        url: tabInfo.url,
      });
    });

    const deleteButton = document.createElement("input");
    deleteButton.type = "button";
    deleteButton.value = "X";
    deleteButton.className = "tab-delete";

    deleteButton.addEventListener("click", () => {
      deleteList(tabs, index);
    });

    tabContainer.appendChild(tabCard);
    tabContainer.appendChild(deleteButton);
    $tabList.appendChild(tabContainer);
  });
}

function deleteList(tabs, index) {
  const copiedTabs = tabs.slice();
  copiedTabs.splice(index, 1);

  setStorage({ tabList: copiedTabs });
  $tabList.textContent = null;
  makeList(copiedTabs);
}
