/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/chromeApi/index.js":
/*!********************************!*\
  !*** ./src/chromeApi/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getCurrentWindowId": () => (/* binding */ getCurrentWindowId),
/* harmony export */   "focusWindow": () => (/* binding */ focusWindow),
/* harmony export */   "focusTab": () => (/* binding */ focusTab),
/* harmony export */   "removeTab": () => (/* binding */ removeTab),
/* harmony export */   "InsertBookmark": () => (/* binding */ InsertBookmark),
/* harmony export */   "createTab": () => (/* binding */ createTab),
/* harmony export */   "awakeAlarm": () => (/* binding */ awakeAlarm),
/* harmony export */   "getCurrentWindowTabList": () => (/* binding */ getCurrentWindowTabList),
/* harmony export */   "getBookmarkTree": () => (/* binding */ getBookmarkTree),
/* harmony export */   "createBookmarkFolder": () => (/* binding */ createBookmarkFolder)
/* harmony export */ });
async function getCurrentWindowId() {
  const { windowId } = await chrome.tabs.getCurrent();
  return windowId;
}

function focusWindow(windowId) {
  chrome.windows.update(windowId, { focused: true });
}

function focusTab(tabId, tabUrl) {
  chrome.tabs.update(tabId, { active: true, selected: true }, (tabInfo) => {
    if (!tabInfo) {
      chrome.tabs.create({
        url: tabUrl,
      });
    }
  });
}

async function removeTab(id) {
  await chrome.tabs.remove(id);
}

function InsertBookmark(id, url, title) {
  chrome.bookmarks.create({
    parentId: id,
    url,
    title,
  });
}

function createTab(url) {
  chrome.tabs.create({
    url,
  });
}

function awakeAlarm() {
  chrome.alarms.create({ periodInMinutes: 4.9 });
  chrome.alarms.onAlarm.addListener(() => {
    return null;
  });
}

async function getCurrentWindowTabList() {
  return await chrome.tabs.query({
    currentWindow: true,
    active: false,
  });
}

async function getBookmarkTree() {
  return await chrome.bookmarks.getTree();
}

async function createBookmarkFolder(title) {
  const treeArr = await getBookmarkTree();
  const bookmarkInfo = treeArr[0];

  let parentId = null;

  for (const child of bookmarkInfo.children) {
    if (child.title === "북마크바" || child.title === "bookmarkBar") {
      parentId = child.id;

      child.children.forEach((info) => {
        if (info.title === title) {
          chrome.storage.local.set({ bookmarkId: info.id });
          parentId = null;
        }
      });
    }

    if (!parentId) return;

    if (parentId) {
      chrome.bookmarks.create(
        {
          parentId,
          title,
        },
        (folder) => {
          chrome.storage.local.set({ bookmarkId: folder.id });
        }
      );

      return;
    }
  }
}


/***/ }),

/***/ "./src/constant/index.js":
/*!*******************************!*\
  !*** ./src/constant/index.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ICON": () => (/* binding */ ICON),
/* harmony export */   "ALL": () => (/* binding */ ALL),
/* harmony export */   "CURRENT": () => (/* binding */ CURRENT),
/* harmony export */   "DEFAULT_FAVICONURL": () => (/* binding */ DEFAULT_FAVICONURL),
/* harmony export */   "FOLDER_NAME": () => (/* binding */ FOLDER_NAME)
/* harmony export */ });
const ICON = {
  bookmarkIcon: `<i class="fa fa-star-o" aria-hidden="true"></i>`,
  checkedBookmarkIcon: `<i class="fa fa-star" aria-hidden="true"></i>`,
  checkMarkIcon: `<i class="fa fa-check-circle-o" aria-hidden="true"></i>`,
  checkedMarkIcon: `<i class="fa fa-check-circle" aria-hidden="true"></i>`,
  deleteButtonIcon: `<i class="fa fa-times-circle" aria-hidden="true"></i>`,
};
const ALL = "all";
const CURRENT = "current";
const DEFAULT_FAVICONURL =
  "https://www.google.com/chrome/static/images/chrome-logo.svg";
const FOLDER_NAME = "Reduce tab";




/***/ }),

/***/ "./src/storage/index.js":
/*!******************************!*\
  !*** ./src/storage/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "setStorage": () => (/* binding */ setStorage),
/* harmony export */   "getTabCount": () => (/* binding */ getTabCount),
/* harmony export */   "getTabList": () => (/* binding */ getTabList),
/* harmony export */   "getBookmarkFolderId": () => (/* binding */ getBookmarkFolderId),
/* harmony export */   "getCurrentOnOff": () => (/* binding */ getCurrentOnOff),
/* harmony export */   "getAllTabs": () => (/* binding */ getAllTabs)
/* harmony export */ });
function setStorage(option) {
  chrome.storage.local.set(option);
}

async function getTabCount() {
  const result = await chrome.storage.local.get(["tabCount"]);
  const tabCount = result.tabCount ?? 8;

  return tabCount;
}

async function getTabList() {
  const { tabList } = await chrome.storage.local.get(["tabList"]);
  return tabList ? tabList : {};
}

async function getBookmarkFolderId() {
  const { bookmarkId } = await chrome.storage.local.get(["bookmarkId"]);
  return bookmarkId;
}

async function getCurrentOnOff() {
  const { isOff } = await chrome.storage.local.get(["isOff"]);
  return isOff;
}

async function getAllTabs() {
  const tabList = await getTabList();
  const currentTabs = await chrome.tabs.query({});
  console.log("storage api ========>", tabList, currentTabs);
  const flattedTabList = Object.values(tabList).flat();
  const allTabs = [...currentTabs, ...flattedTabList];

  return allTabs;
}


/***/ }),

/***/ "./src/utils/chart.js":
/*!****************************!*\
  !*** ./src/utils/chart.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "chart": () => (/* binding */ chart)
/* harmony export */ });
const chart = (function () {
  return {
    init: async function (target, tabList, center) {
      const rankList = this.calculateTabCount(tabList);
      const totalLength = tabList.length;

      if (!rankList) return;

      const chartData = this.calculateDegree(rankList, totalLength);

      this.drawChart(chartData, target, center, totalLength);
    },
    calculateTabCount: function (tabList) {
      const tabs = tabList;
      const tabObj = {};

      if (tabs.length < 10) return;

      tabs.forEach((tab) => {
        const tabUrl = tab.url;

        if (tabUrl === "chrome://newtab/") return;

        const pattern = /\/\/([a-z0-9-_\.]*)[\/\?]/i;
        const result = tabUrl.match(pattern);

        if (!result) return;

        const url = result[1];

        if (tabObj.hasOwnProperty(url)) {
          tabObj[url].number += 1;
        } else {
          tabObj[url] = { number: 1, favIconUrl: tab.favIconUrl };
        }
      });

      const rankData = this.reArrangeObj(tabObj, 4);

      return rankData;
    },
    reArrangeObj: function (tabObj, rankNumber) {
      const result = [];

      for (const prop in tabObj) {
        result.push({
          url: prop,
          number: tabObj[prop].number,
          favIconUrl: tabObj[prop].favIconUrl,
        });
      }

      return result
        .slice()
        .sort((a, b) => b.number - a.number)
        .slice(0, rankNumber);
    },
    calculateDegree: function (list, allTabsLength) {
      list.forEach((info, i) => {
        const degree = Math.floor((info.number / allTabsLength) * 360);

        i > 0
          ? (info.degree = list[i - 1].degree + degree)
          : (info.degree = degree);
      });

      return list;
    },
    drawChart: function (chartData, target, position, total) {
      const color = ["#5185ec", "#d85140", "#f1be42", "#58a55c", "#e9e9e7"];
      chartData.push({ degree: 360, url: "etc" });

      const centerX = position.chartCenter;
      const centerY = position.chartCenter;
      const rectX = position.rectX;
      const rectY = position.rectY;
      const radius = 100;
      const message = `Total ${total}`;

      if (target.getContext) {
        const ctx = target.getContext("2d");
        ctx.font = "12px Sans-Serif";

        for (let i = 0; i < chartData.length; i++) {
          const calRadian1 = (chartData[i - 1]?.degree * Math.PI) / 180;
          const calRadian2 = (chartData[i].degree * Math.PI) / 180;

          ctx.beginPath();
          ctx.fillStyle = color[i];
          ctx.moveTo(centerX, centerY);

          i === 0
            ? ctx.arc(centerX, centerY, radius, 0, calRadian2, false)
            : ctx.arc(centerX, centerY, radius, calRadian1, calRadian2, false);

          ctx.closePath();
          ctx.fill();

          this.roundedRect(ctx, 10, rectX + i * 20, rectY, 10, 4, color[i]);

          ctx.fillStyle = "black";
          ctx.fillText(chartData[i].url, 25, rectX + 10 + i * 20);
        }

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(centerX, centerY, centerX * 0.4, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillStyle = "black";
        ctx.fillText(message, centerX - 20, centerY);
      }
    },
    roundedRect: function (ctx, x, y, width, height, radius, color) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y + height, x + radius, y + height, radius);
      ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
      ctx.arcTo(x + width, y, x + width - radius, y, radius);
      ctx.arcTo(x, y, x, y + radius, radius);
      ctx.fill();
    },
  };
})();


/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "chart": () => (/* reexport safe */ _chart__WEBPACK_IMPORTED_MODULE_0__.chart),
/* harmony export */   "search": () => (/* reexport safe */ _search__WEBPACK_IMPORTED_MODULE_1__.search),
/* harmony export */   "onoffSwitch": () => (/* reexport safe */ _switch__WEBPACK_IMPORTED_MODULE_2__.onoffSwitch),
/* harmony export */   "tabCount": () => (/* reexport safe */ _tab__WEBPACK_IMPORTED_MODULE_3__.tabCount),
/* harmony export */   "tabList": () => (/* reexport safe */ _tab__WEBPACK_IMPORTED_MODULE_3__.tabList),
/* harmony export */   "deleteTab": () => (/* reexport safe */ _tab__WEBPACK_IMPORTED_MODULE_3__.deleteTab),
/* harmony export */   "controlTab": () => (/* reexport safe */ _tab__WEBPACK_IMPORTED_MODULE_3__.controlTab)
/* harmony export */ });
/* harmony import */ var _chart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chart */ "./src/utils/chart.js");
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search */ "./src/utils/search.js");
/* harmony import */ var _switch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./switch */ "./src/utils/switch.js");
/* harmony import */ var _tab__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tab */ "./src/utils/tab.js");








/***/ }),

/***/ "./src/utils/search.js":
/*!*****************************!*\
  !*** ./src/utils/search.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "search": () => (/* binding */ search)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.js");
/* harmony import */ var _chromeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../chromeApi */ "./src/chromeApi/index.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constant */ "./src/constant/index.js");




const search = (function () {
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
        case _constant__WEBPACK_IMPORTED_MODULE_2__.ALL:
          return await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getAllTabs)();
        case _constant__WEBPACK_IMPORTED_MODULE_2__.CURRENT:
          const tabList = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabList)();
          const windowId = await (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.getCurrentWindowId)();
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
      }, 400);
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
      tabFavicon.src = tab.favIconUrl ? tab.favIconUrl : _constant__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_FAVICONURL;

      tabList.append(tabFavicon, tabTitle);

      return tabList;
    },
    clickTab: function (target, tab) {
      target.addEventListener("click", this.openTab.bind(this, tab));
    },
    openTab: function (tab) {
      (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.focusWindow)(tab.windowId);
      (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.focusTab)(tab.id, tab.url);
    },
    resetElement: function (target) {
      target.textContent = null;
    },
  };
})();


/***/ }),

/***/ "./src/utils/switch.js":
/*!*****************************!*\
  !*** ./src/utils/switch.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onoffSwitch": () => (/* binding */ onoffSwitch)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.js");
/* harmony import */ var _tab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tab */ "./src/utils/tab.js");



const onoffSwitch = (function () {
  function controlSwitch(event) {
    event.target.checked
      ? (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ isOff: false })
      : (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ isOff: true });

    if (event.target.checked) {
      _tab__WEBPACK_IMPORTED_MODULE_1__.controlTab.remove();
    }
  }

  return {
    click: function (target) {
      this.getCurrentSwitch(target);
      target.addEventListener("click", controlSwitch);
    },
    getCurrentSwitch: async function (target) {
      const isOff = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getCurrentOnOff)();
      target.checked = !isOff;
    },
  };
})();


/***/ }),

/***/ "./src/utils/tab.js":
/*!**************************!*\
  !*** ./src/utils/tab.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tabCount": () => (/* binding */ tabCount),
/* harmony export */   "tabList": () => (/* binding */ tabList),
/* harmony export */   "deleteTab": () => (/* binding */ deleteTab),
/* harmony export */   "controlTab": () => (/* binding */ controlTab)
/* harmony export */ });
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../storage */ "./src/storage/index.js");
/* harmony import */ var _chromeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../chromeApi */ "./src/chromeApi/index.js");
/* harmony import */ var _constant__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constant */ "./src/constant/index.js");






const tabCount = (function () {
  function saveTabCount(event) {
    const count = event.target.value;

    if (count < 5 || count > 25) {
      event.target.value = 8;
      (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabCount: 8 });
      return;
    }

    (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabCount: count });
  }

  return {
    init: function (target) {
      this.showCurrentTabCount(target);
      this.changeTabCount(target);
    },
    showCurrentTabCount: async function (target) {
      const tabCount = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabCount)();
      target.value = tabCount;
    },
    changeTabCount: function (target) {
      target.addEventListener("change", saveTabCount);
    },
  };
})();

const tabList = (function () {
  let tabList;
  let windowId;

  return {
    init: async function (target) {
      const { list, id } = await this.getCurrentWindowTabInfo();

      if (!Object.keys(list).length) return;

      tabList = list;
      windowId = id;
      this.spreadTabList(target);
    },
    getCurrentWindowTabInfo: async function () {
      const list = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabList)();
      const id = await (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.getCurrentWindowId)();

      return { list, id };
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
      tabFavicon.src = tab.favIconUrl ? tab.favIconUrl : _constant__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_FAVICONURL;

      const tabTitle = document.createElement("span");
      tabTitle.textContent = tab.title;

      tabCard.append(tabFavicon, tabTitle);

      tabCard.className = "tab-card";

      tabCard.addEventListener("click", () => {
        (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.createTab)(tab.url);
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
        ? _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkedMarkIcon
        : _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkMarkIcon;

      checkMark.addEventListener("click", this.handleCheckmark.bind(this, tab));

      return checkMark;
    },
    handleCheckmark: function (tab, event) {
      if (event.target.tagName === "BUTTON") return;
      const targetParent = event.target.parentElement;

      targetParent.innerHTML =
        targetParent.innerHTML === _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkedMarkIcon
          ? _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkMarkIcon
          : _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkedMarkIcon;

      tab.checked = tab.checked ? false : true;

      this.saveTabList();
    },
    createBookmark: function (tab) {
      const bookmark = document.createElement("button");
      bookmark.className = "bookmark";
      bookmark.innerHTML = tab.bookmark
        ? _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkedBookmarkIcon
        : _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.bookmarkIcon;

      bookmark.addEventListener("click", this.handleBookmark.bind(this, tab));

      return bookmark;
    },
    handleBookmark: function (tab, event) {
      if (event.target.tagName === "BUTTON" || tab.bookmark) return;
      const targetParent = event.target.parentElement;
      targetParent.innerHTML = _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.checkedBookmarkIcon;

      tab.bookmark = true;

      const url = tab.url;
      const title = tab.title;

      this.saveBookmark(url, title);
      this.saveTabList();
    },
    saveBookmark: async function (url, title) {
      const bookmarkId = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getBookmarkFolderId)();

      (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.InsertBookmark)(bookmarkId, url, title);
    },
    saveTabList: function () {
      (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabList });
    },
    createDelete: function (tab) {
      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.innerHTML = _constant__WEBPACK_IMPORTED_MODULE_2__.ICON.deleteButtonIcon;

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

const deleteTab = (function () {
  return {
    clickButton: function (button, target) {
      button.addEventListener("click", this.deleteAtOnce.bind(this, target));
    },
    getCurrentTabList: async function () {
      const tabList = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabList)();
      const windowId = await (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.getCurrentWindowId)();
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

        (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabList });
        this.rerenderList(target);
      }
    },
    rerenderList: function (target) {
      target.textContent = null;
      tabList.init(target);
    },
  };
})();

const controlTab = (function () {
  return {
    remove: async function () {
      const current = await (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.getCurrentWindowTabList)();
      const tabCount = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabCount)();

      if (current.length >= tabCount) {
        const tabList = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabList)();

        if (!tabList.hasOwnProperty(current[0].windowId)) {
          tabList[current[0].windowId] = current;
        } else {
          const currentTabs = current.slice(1);
          tabList[current[0].windowId].push(...currentTabs);
        }

        (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabList });
        (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.createBookmarkFolder)(_constant__WEBPACK_IMPORTED_MODULE_2__.FOLDER_NAME);

        const tabIds = [];

        current.forEach((tab) => {
          tabIds.push(tab.id);
        });

        await (0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.removeTab)(tabIds);

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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./storage */ "./src/storage/index.js");
/* harmony import */ var _chromeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./chromeApi */ "./src/chromeApi/index.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils/index.js");




(0,_chromeApi__WEBPACK_IMPORTED_MODULE_1__.awakeAlarm)();

chrome.windows.onRemoved.addListener(async (id) => {
  const tabList = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getTabList)();

  if (!Object.keys(tabList).length || !!tabList[id]) return;

  if (Object.keys(tabList).length === 1) {
    (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabList: null });
    return;
  }

  const copiedTabList = Object.assign({}, tabList);
  delete copiedTabList[id];

  (0,_storage__WEBPACK_IMPORTED_MODULE_0__.setStorage)({ tabList: copiedTabList });
});

chrome.tabs.onActivated.addListener(async (tab) => {
  const isOff = await (0,_storage__WEBPACK_IMPORTED_MODULE_0__.getCurrentOnOff)();

  if (!isOff) {
    _utils__WEBPACK_IMPORTED_MODULE_2__.controlTab.remove();
  }
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map