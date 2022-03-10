export async function getCurrentWindow() {
  const { windowId } = await chrome.tabs.getCurrent();
  return windowId;
}

export function focusWindow(windowId) {
  chrome.windows.update(windowId, { focused: true });
}

export function focusTab(tabId, tabUrl) {
  chrome.tabs.update(tabId, { active: true, selected: true }, (tabInfo) => {
    if (!tabInfo) {
      chrome.tabs.create({
        url: tabUrl,
      });
    }
  });
}

export async function removeTab(id) {
  await chrome.tabs.remove(id);
}

export function InsertBookmark(id, url, title) {
  chrome.bookmarks.create({
    parentId: id,
    url,
    title,
  });
}

export function createTab(url) {
  chrome.tabs.create({
    url,
  });
}

export function awakeAlarm() {
  chrome.alarms.create({ periodInMinutes: 4.9 });
  chrome.alarms.onAlarm.addListener(() => {
    return null;
  });
}

export async function getCurrentWindowTabList() {
  return await chrome.tabs.query({
    currentWindow: true,
    active: false,
  });
}

export async function getBookmarkTree() {
  return await chrome.bookmarks.getTree();
}

export async function createBookmarkFolder(title) {
  const treeArr = await getBookmarkTree();
  const bookmarkInfo = treeArr[0];

  let parentId = null;

  for (const child of bookmarkInfo.children) {
    if (child.title === "북마크바" || child.title === "bookmarkBar") {
      parentId = child.id;

      child.children.forEach((info) => {
        if (info.title === title) {
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
