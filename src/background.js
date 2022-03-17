import { getCurrentOnOff, getTabList, setStorage } from "./storage";
import { awakeAlarm } from "./chromeApi";
import { controlTab } from "./utils";

awakeAlarm();

chrome.windows.onRemoved.addListener(async (id) => {
  const tabList = await getTabList();

  if (!Object.keys(tabList).length || !!tabList[id]) return;

  if (Object.keys(tabList).length === 1) {
    setStorage({ tabList: null });
    return;
  }

  const copiedTabList = Object.assign({}, tabList);
  delete copiedTabList[id];

  setStorage({ tabList: copiedTabList });
});

chrome.tabs.onActivated.addListener(async (tab) => {
  const isOff = await getCurrentOnOff();

  if (!isOff) {
    controlTab.remove();
  }
});
