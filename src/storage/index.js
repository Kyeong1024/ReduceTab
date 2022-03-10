export function setStorage(option) {
  chrome.storage.local.set(option);
}

export async function getTabCount() {
  const result = await chrome.storage.local.get(["tabCount"]);
  const tabCount = result.tabCount ?? 8;

  return tabCount;
}

export async function getTabList() {
  const { tabList } = await chrome.storage.local.get(["tabList"]);
  return tabList ? tabList : {};
}

export async function getBookmarkFolderId() {
  const { bookmarkId } = await chrome.storage.local.get(["bookmarkId"]);
  return bookmarkId;
}

export async function getCurrentOnOff() {
  const { isOff } = await chrome.storage.local.get(["isOff"]);
  return isOff;
}

export async function getAllTabs() {
  const tabList = await getTabList();
  const currentTabs = await chrome.tabs.query({});

  const flattedTabList = Object.values(tabList).flat();
  const allTabs = [...currentTabs, ...flattedTabList];

  return allTabs;
}
