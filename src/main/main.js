import "./style.css";
import { getTabList, setStorage } from "../utils/storage";

const $tabList = document.getElementById("tab-list");
let id = null;

chrome.tabs.getCurrent(async (currentTab) => {
  const { tabList } = await getTabList();
  const tabs = tabList[currentTab.windowId];
  id = currentTab.windowId;

  makeList(tabs, tabList);
});

function makeList(tabs, tabList) {
  tabs.forEach((tabInfo, index) => {
    const tabContainer = document.createElement("div");
    tabContainer.className = "tab-container";

    const tabCard = document.createElement("div");

    const tabFavicon = document.createElement("img");
    tabFavicon.className = "tab-favicon";
    tabFavicon.src = tabInfo.favIconUrl
      ? tabInfo.favIconUrl
      : "https://www.google.com/chrome/static/images/chrome-logo.svg";

    const tabTitle = document.createElement("span");
    tabTitle.textContent =
      tabInfo.title.length > 50
        ? `${tabInfo.title.slice(0, 50)}...`
        : tabInfo.title;

    tabCard.append(tabFavicon, tabTitle);

    tabCard.className = "tab-card";

    tabCard.addEventListener("click", () => {
      chrome.tabs.create({
        url: tabInfo.url,
      });
    });

    const checkMark = document.createElement("button");
    checkMark.className = "checkmark";
    checkMark.innerHTML = `<i class="fa fa-check-circle-o" aria-hidden="true"></i>`;
    // checkMark.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i>`; // check mark 체크시

    const bookMark = document.createElement("button");
    bookMark.className = "bookmark";
    bookMark.innerHTML = `<i class="fa fa-star-o" aria-hidden="true"></i>`;
    // bookMark.innerHTML = `<i class="fa fa-star" aria-hidden="true"></i>`; // book mark 체크시

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = `<i class="fa fa-times-circle" aria-hidden="true"></i>`;

    deleteButton.addEventListener("click", () => {
      deleteList(tabs, tabList, index);
    });

    tabContainer.appendChild(checkMark);
    tabContainer.appendChild(bookMark);
    tabContainer.appendChild(tabCard);
    tabContainer.appendChild(deleteButton);
    $tabList.appendChild(tabContainer);
  });
}

function deleteList(tabs, tabList, index) {
  const copiedTabs = tabs.slice();

  copiedTabs.splice(index, 1);
  tabList[id] = copiedTabs;

  setStorage({ tabList });

  $tabList.textContent = null;

  makeList(copiedTabs, tabList);
}
