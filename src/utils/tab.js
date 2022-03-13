import {
  getTabCount,
  setStorage,
  getTabList,
  getBookmarkFolderId,
} from "../storage";

import {
  getCurrentWindowId,
  InsertBookmark,
  createTab,
  createBookmarkFolder,
  getCurrentWindowTabList,
  removeTab,
} from "../chromeApi";

import { ICON, DEFAULT_FAVICONURL, FOLDER_NAME } from "../constant";

export const tabCount = (function () {
  function saveTabCount(event) {
    const count = event.target.value;

    if (count < 5 || count > 25) {
      event.target.value = 8;
      setStorage({ tabCount: 8 });
      return;
    }

    setStorage({ tabCount: count });
  }

  return {
    init: function (target) {
      this.showCurrentTabCount(target);
      this.changeTabCount(target);
    },
    showCurrentTabCount: async function (target) {
      const tabCount = await getTabCount();
      target.value = tabCount;
    },
    changeTabCount: function (target) {
      target.addEventListener("change", saveTabCount);
    },
  };
})();

export const tabList = (function () {
  let tabList;
  let windowId;

  return {
    init: async function (target) {
      await this.getCurrentWindowTabInfo();
      this.spreadTabList(target);
    },
    getCurrentWindowTabInfo: async function () {
      tabList = await getTabList();
      windowId = await getCurrentWindowId();
    },
    spreadTabList: function (target) {
      const currentTabs = tabList[windowId].slice();
      const result = currentTabs.map((tab) => {
        return this.createTabCard(tab);
      });

      target.append(...result);
    },
    createTabCard: function (tab) {
      const tabContainer = document.createElement("div");
      tabContainer.className = "tab-container";

      const tabCard = document.createElement("div");

      const tabFavicon = document.createElement("img");
      tabFavicon.className = "tab-favicon";
      tabFavicon.src = tab.favIconUrl ? tab.favIconUrl : DEFAULT_FAVICONURL;

      const tabTitle = document.createElement("span");
      tabTitle.textContent = tab.title;

      tabCard.append(tabFavicon, tabTitle);

      tabCard.className = "tab-card";

      tabCard.addEventListener("click", () => {
        createTab(tab.url);
      });

      const checkmarkButton = this.createCheckmark(tab);
      const bookmarkButton = this.createBookmark(tab);
      const deleteButton = this.createDelete(tab);

      tabContainer.append(
        checkmarkButton,
        bookmarkButton,
        tabCard,
        deleteButton
      );

      return tabContainer;
    },
    createCheckmark: function (tab) {
      const checkMark = document.createElement("button");

      checkMark.className = "checkmark";
      checkMark.innerHTML = tab.checked
        ? ICON.checkedMarkIcon
        : ICON.checkMarkIcon;

      checkMark.addEventListener("click", this.handleCheckmark.bind(this, tab));

      return checkMark;
    },
    handleCheckmark: function (tab, event) {
      if (event.target.tagName === "BUTTON") return;
      const targetParent = event.target.parentElement;

      targetParent.innerHTML =
        targetParent.innerHTML === ICON.checkedMarkIcon
          ? ICON.checkMarkIcon
          : ICON.checkedMarkIcon;

      tab.checked = tab.checked ? false : true;

      this.saveTabList();
    },
    createBookmark: function (tab) {
      const bookmark = document.createElement("button");
      bookmark.className = "bookmark";
      bookmark.innerHTML = tab.bookmark
        ? ICON.checkedBookmarkIcon
        : ICON.bookmarkIcon;

      bookmark.addEventListener("click", this.handleBookmark.bind(this, tab));

      return bookmark;
    },
    handleBookmark: function (tab, event) {
      if (event.target.tagName === "BUTTON" || tab.bookmark) return;
      const targetParent = event.target.parentElement;
      targetParent.innerHTML = ICON.checkedBookmarkIcon;

      tab.bookmark = true;

      const url = tab.url;
      const title = tab.title;

      this.saveBookmark(url, title);
      this.saveTabList();
    },
    saveBookmark: async function (url, title) {
      const bookmarkId = await getBookmarkFolderId();

      InsertBookmark(bookmarkId, url, title);
    },
    saveTabList: function () {
      setStorage({ tabList });
    },
    createDelete: function (tab) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = ICON.deleteButtonIcon;

      deleteButton.addEventListener("click", this.handleDelete.bind(this, tab));

      return deleteButton;
    },
    handleDelete: function (tab, event) {
      if (event.target.tagName === "BUTTON") return;
      const tabCardElement = event.target.parentElement.parentElement;

      tabCardElement.parentElement.removeChild(tabCardElement);

      this.deleteTarget(tab);
    },
    deleteTarget: function (clickedTab) {
      tabList[windowId] = tabList[windowId].filter(
        (tabInfo) => tabInfo.id !== clickedTab.id
      );

      this.saveTabList();
    },
  };
})();

export const deleteTab = (function () {
  return {
    clickButton: function (button, target) {
      button.addEventListener("click", this.deleteAtOnce.bind(this, target));
    },
    getCurrentTabList: async function () {
      const tabList = await getTabList();
      const windowId = await getCurrentWindowId();
      return { tabList, windowId };
    },
    deleteAtOnce: async function (target) {
      const { tabList, windowId } = await this.getCurrentTabList();
      const currentWindowTabs = tabList[windowId];

      const checkedTab = currentWindowTabs.filter(
        (tab) => !!tab.checked === true
      );

      const difference = currentWindowTabs.length - checkedTab.length;
      const message = `${difference}개의 tab정보를 삭제하시겠습니까?`;

      if (difference === 0) {
        alert("삭제할 정보가 없습니다.");
        return;
      }

      if (window.confirm(message)) {
        tabList[windowId] = checkedTab;

        setStorage({ tabList });
        this.rerenderList(target);
      }
    },
    rerenderList: function (target) {
      target.textContent = null;
      tabList.init(target);
    },
  };
})();

export const controlTab = (function () {
  return {
    remove: async function () {
      const current = await getCurrentWindowTabList();
      const tabCount = await getTabCount();

      if (current.length >= tabCount) {
        const tabList = await getTabList();

        if (!tabList.hasOwnProperty(current[0].windowId)) {
          tabList[current[0].windowId] = current;
        } else {
          const currentTabs = current.slice(1);
          tabList[current[0].windowId].push(...currentTabs);
        }

        setStorage({ tabList });
        createBookmarkFolder(FOLDER_NAME);

        const tabIds = [];

        current.forEach((tab) => {
          tabIds.push(tab.id);
        });

        await removeTab(tabIds);

        this.createMainPage();
      }
    },
    createMainPage: function () {
      chrome.tabs.create({
        url: "main.html",
        pinned: true,
      });
    },
  };
})();
