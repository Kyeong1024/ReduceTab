export async function getCurrentWindow() {
  return await chrome.tabs.getCurrent();
}

export async function getBookmarkTree() {
  return await chrome.bookmarks.getTree();
}
