import { getOnOff, getTabCount, getTabList, setStorage } from "./utils/storage";

// chrome.tabs.onActivated.addListener(() => { // 초기 설정부분
//   chrome.tabs.query(
//     {
//       currentWindow: true,
//       activate: false,
//     },
//     (currentTabs) => {}
//   );
// });

chrome.windows.onRemoved.addListener(async (id) => {
  // 탭 전체 삭제 시 tablist 데이터 삭제
  const { tabList } = await getTabList();
  if (!Object.keys(tabList).length) return;

  const copiedTabList = Object.assign({}, tabList);
  delete copiedTabList[id];

  setStorage({ tabList: copiedTabList });
});

chrome.tabs.onActivated.addListener(async () => {
  const { isOff } = await getOnOff();

  if (isOff) return;

  chrome.tabs.query(
    {
      currentWindow: true,
      active: false,
    },
    async (current) => {
      const tabCount = await getTabCount();

      if (current.length > tabCount) {
        let { tabList } = await getTabList(); // let으로 주는 것 이상함. 고칠필요 있음

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
