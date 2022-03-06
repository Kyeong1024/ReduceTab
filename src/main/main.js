import "./style.css";
import { getTabList, setStorage, getBookmarkFolderId } from "../utils/storage";
import { getBookmarkTree, getCurrentWindow } from "../utils/api";

const $tabList = document.getElementById("tab-list");
const $trashcan = document.getElementById("trashcan");
const $searchInput = document.getElementById("search-input");
const $searchResult = document.getElementById("search-result");
const $filterContainer = document.getElementById("filter-container");
const $filter = document.querySelectorAll(".filter");

const bookmarkIcon = `<i class="fa fa-star-o" aria-hidden="true"></i>`;
const checkedBookmarkIcon = `<i class="fa fa-star" aria-hidden="true"></i>`;
const checkMarkIcon = `<i class="fa fa-check-circle-o" aria-hidden="true"></i>`;
const checkedMarkIcon = `<i class="fa fa-check-circle" aria-hidden="true"></i>`;
const deleteButtonIcon = `<i class="fa fa-times-circle" aria-hidden="true"></i>`;
let id = null;
let maxIndex = null;

getTree();
getId();
getTabs();

let timer;

$searchInput.addEventListener("input", (event) => {
  // 검색 debounce
  if (timer) {
    clearTimeout(timer);
    $searchResult.textContent = null;
  }

  timer = setTimeout(async () => {
    if (event.target.value === "") {
      $searchResult.textContent = null;
      return;
    }

    const { tabList } = await getTabList();

    tabList[id].forEach((tabInfo) => {
      const trimedText = tabInfo.title.replace(/ /gi, "").toLowerCase();

      if (trimedText.includes(event.target.value)) {
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

        tabContainer.appendChild(tabCard);
        $searchResult.appendChild(tabContainer);
      }
    });
  }, 300);
});

$filterContainer.addEventListener("click", async (event) => {
  if (event.target.className === "filter") {
    $filter.forEach((element) => {
      element.classList.remove("underline");
    });

    event.target.classList.add("underline");

    const { tabList } = await getTabList();
    const tabs = tabList[id];

    switch (event.target.textContent) {
      case "All":
        $tabList.textContent = null;
        spreadTabList(tabList, tabs, "all");
        break;
      case "Checked":
        $tabList.textContent = null;
        spreadTabList(tabList, tabs, "checked");
        break;
      case "Unchecked":
        $tabList.textContent = null;
        spreadTabList(tabList, tabs, "unchecked");
        break;
      default:
        break;
    }
  }
});

$trashcan.addEventListener("click", async () => {
  const { tabList } = await getTabList();
  const checkedTabList = tabList[id].filter((tab) => tab.checked === true);

  const diff = tabList[id].length - checkedTabList.length;
  const message = `${diff}개의 tab정보를 삭제하시겠습니까?`;

  if (!diff) {
    alert("삭제할 정보가 없습니다.");
    return;
  }

  if (window.confirm(message)) {
    tabList[id] = checkedTabList;

    $tabList.textContent = null;

    setStorage({ tabList });
    spreadTabList(tabList, tabList[id]);
  }
});

async function getTree() {
  const treeArr = await getBookmarkTree();
  const bookmarkInfo = treeArr[0];

  createBookmarkFolder(bookmarkInfo);
}

async function getId() {
  const { windowId } = await getCurrentWindow();
  id = windowId;
}

function createBookmarkFolder(bookmarkInfo) {
  let parentId = null;

  for (const child of bookmarkInfo.children) {
    if (child.title === "북마크바" || child.title === "bookmarkBar") {
      parentId = child.id;

      child.children.forEach((info) => {
        if (info.title === "Reduce Tab") {
          parentId = null;
        }
      });
    }

    if (!parentId) return;

    if (parentId) {
      chrome.bookmarks.create(
        {
          parentId,
          title: "Reduce Tab",
        },
        (folder) => {
          setStorage({ bookmarkId: folder.id });
        }
      );

      return;
    }
  }
}

async function getTabs() {
  const { tabList } = await getTabList();
  const tabs = tabList[id];

  spreadTabList(tabList, tabs);
}

function spreadTabList(tabList, tabs, filter) {
  const copiedTabs = tabs.slice();
  maxIndex = copiedTabs.length - 1;

  copiedTabs.forEach((tabInfo, index) => {
    if (
      (filter === "checked" && !tabInfo.checked) ||
      (filter === "unchecked" && tabInfo.checked)
    ) {
      return;
    }

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
    checkMark.innerHTML = tabInfo.checked ? checkedMarkIcon : checkMarkIcon;

    checkMark.addEventListener("click", (event) => {
      const targetParent = event.target.parentElement;
      targetParent.innerHTML =
        targetParent.innerHTML === checkedMarkIcon
          ? checkMarkIcon
          : checkedMarkIcon;

      handleCheckMark(tabList, index);
    });

    const bookMark = document.createElement("button");
    bookMark.className = "bookmark";
    bookMark.innerHTML = tabInfo.bookMark ? checkedBookmarkIcon : bookmarkIcon;

    bookMark.addEventListener("click", (event) => {
      bookMark.disabled = "disabled";

      const targetParent = event.target.parentElement;
      targetParent.innerHTML = checkedBookmarkIcon;

      handleBookmark(tabList, index);
    });

    if (filter === "checked" || filter === "unchecked") {
      // checked, unchecked일때 delete방지
      tabContainer.append(checkMark, bookMark, tabCard);
      $tabList.appendChild(tabContainer);
      return;
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.innerHTML = deleteButtonIcon;

    deleteButton.addEventListener("click", (event) => {
      if (event.target.tagName === "BUTTON") return; // i tag를 클릭해야 사라지도록 방어
      event.target.parentElement.parentElement.parentElement.removeChild(
        event.target.parentElement.parentElement
      );

      deleteList(copiedTabs, index);
    });

    tabContainer.append(checkMark, bookMark, tabCard, deleteButton);
    $tabList.appendChild(tabContainer);
  });
}

async function deleteList(copiedTabs, index) {
  const { tabList } = await getTabList();

  if (index > maxIndex) {
    index = index - (index - maxIndex);
  }

  copiedTabs.splice(index, 1);
  tabList[id] = copiedTabs;
  setStorage({ tabList });

  maxIndex -= 1;
}

function handleBookmark(tabList, index) {
  const target = tabList[id][index];
  target["bookMark"] = true;

  const url = target.url;
  const title = target.title;

  saveBookmark(url, title);
  setStorage({ tabList });
}

function handleCheckMark(tabList, index) {
  const target = tabList[id][index];
  target["checked"] = target["checked"] ? false : true;

  setStorage({ tabList });
}

async function saveBookmark(url, title) {
  const { bookmarkId } = await getBookmarkFolderId();

  chrome.bookmarks.create({
    parentId: bookmarkId,
    url,
    title,
  });
}
