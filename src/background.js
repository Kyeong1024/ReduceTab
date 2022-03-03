import { getTabCount, getTabList, setStorage } from "./utils/storage";

// chrome.tabs.onActivated.addListener(() => { // 초기 설정부분
//   chrome.tabs.query(
//     {
//       currentWindow: true,
//       activate: false,
//     },
//     (currentTabs) => {}
//   );
// });

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.query(
    {
      currentWindow: true,
      active: false,
    },
    async (current) => {
      const tabCount = await getTabCount();

      if (current.length > tabCount) {
        let { tabList } = await getTabList();

        console.log("tabList from background ==== >", tabList);
        if (!tabList) {
          setStorage({ tabList: {} });
          tabList = {};
        }

        if (!tabList.hasOwnProperty(current[0].windowId)) {
          tabList[current[0].windowId] = current;
        } else {
          const currentTabs = current.slice();

          currentTabs.shift(); // main page 제외
          tabList[current[0].windowId].push(...currentTabs);
        }

        setStorage({ tabList });

        current.forEach((tab) => {
          chrome.tabs.remove(tab.id);
        });

        chrome.tabs.create({
          url: "main.html",
          pinned: true,
        });
      }
    }
  );
});
