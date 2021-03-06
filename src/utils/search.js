import { getAllTabs, getTabList } from "../storage";
import { getCurrentWindowId, focusTab, focusWindow } from "../chromeApi";
import { ALL, CURRENT, DEFAULT_FAVICONURL } from "../constant";

export const search = (function () {
  let timer;
  let listName;

  return {
    init: function (target, resultElement, name) {
      listName = name;

      document.body.addEventListener(
        "click",
        this.resetElement.bind(this, resultElement)
      );

      target.addEventListener("input", this.debounce.bind(this, resultElement));
    },
    getTabList: async function (name) {
      switch (name) {
        case ALL:
          return await getAllTabs();
        case CURRENT:
          const tabList = await getTabList();
          const windowId = await getCurrentWindowId();
          return tabList[windowId];
        default:
          break;
      }
    },
    debounce: function (resultElement, event) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        this.searchText(resultElement, event);
      }, 300);
    },
    searchText: async function (resultElement, event) {
      if (!event.target.value) {
        this.resetElement(resultElement);
        return;
      }

      this.resetElement(resultElement);

      const targetTabList = await this.getTabList(listName);

      if (!targetTabList) return;

      targetTabList.forEach((tab) => {
        const trimedText = tab.title.replace(/ /gi, "").toLowerCase();

        if (trimedText.includes(event.target.value)) {
          const tabList = this.createTabList(tab);
          this.clickTab(tabList, tab);

          resultElement.append(tabList);
        }
      });
    },
    createTabList: function (tab) {
      const tabList = document.createElement("li");
      tabList.className = "list";

      const tabTitle = document.createElement("span");
      tabTitle.className = "tab-title";
      tabTitle.textContent = tab.title;

      const tabFavicon = document.createElement("img");
      tabFavicon.className = "tab-favicon";
      tabFavicon.src = tab.favIconUrl ? tab.favIconUrl : DEFAULT_FAVICONURL;

      tabList.append(tabFavicon, tabTitle);

      return tabList;
    },
    clickTab: function (target, tab) {
      target.addEventListener("click", this.openTab.bind(this, tab));
    },
    openTab: function (tab) {
      focusWindow(tab.windowId);
      focusTab(tab.id, tab.url);
    },
    resetElement: function (target) {
      target.textContent = null;
    },
  };
})();
