export function setStorage(option) {
  chrome.storage.local.set(option);
}

export async function getTabCount() {
  const result = await chrome.storage.local.get(["tabCount"]);
  const tabCount = result.tabCount ?? 8;

  return tabCount;
}

export async function getTabList() {
  return await chrome.storage.local.get(["tabList"]);
}
