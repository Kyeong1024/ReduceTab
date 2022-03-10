import { getCurrentOnOff, getTabList, setStorage } from "./storage";
import { awakeAlarm, createBookmarkFolder } from "./chromeApi";
import { controlTab } from "./utils";

awakeAlarm();

chrome.windows.onRemoved.addListener(async (id) => {
  const tabList = await getTabList();
  if (!Object.keys(tabList).length) return;

  const copiedTabList = Object.assign({}, tabList);
  delete copiedTabList[id];

  setStorage({ tabList: copiedTabList });
});

chrome.tabs.onActivated.addListener(async () => {
  const isOff = await getCurrentOnOff();

  if (!isOff) {
    controlTab.remove();
  }
});
