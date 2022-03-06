import "./style.css";
import { getAllTabs } from "../utils/api";
import {
  getOnOff,
  getTabCount,
  getTabList,
  setStorage,
} from "../utils/storage";

const $tabCount = document.getElementById("tab-count");
const $onoff = document.getElementById("on-off-switch");
const $searchInput = document.getElementById("search-input");
const $searchResult = document.getElementById("search-result");
const $chartContainer = document.getElementById("chart-container");
const canvas = document.getElementById("chart");

showTabCount();
getCurrentOnOff();

let timer;

document.body.addEventListener("click", () => {
  $searchResult.textContent = null;
});

$searchInput.addEventListener("input", (event) => {
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
    const unSavedTabs = await getAllTabs();

    const TabListValue = Object.values(tabList);
    const allTabs = [...TabListValue.flat(), ...unSavedTabs];

    allTabs.forEach((tabInfo, index) => {
      const trimedText = tabInfo.title.replace(/ /gi, "").toLowerCase();

      if (trimedText.includes(event.target.value)) {
        if (allTabs[index - 1]?.url === tabInfo.url) return;
        const tabList = document.createElement("li");
        tabList.className = "tab-list";

        const tabTitle = document.createElement("span");
        tabTitle.textContent = tabInfo.title;

        const tabFavicon = document.createElement("img");
        tabFavicon.className = "tab-favicon";
        tabFavicon.src = tabInfo.favIconUrl
          ? tabInfo.favIconUrl
          : "https://www.google.com/chrome/static/images/chrome-logo.svg";

        tabList.append(tabFavicon, tabTitle);

        tabList.addEventListener("click", () => {
          chrome.windows.update(tabInfo.windowId, { focused: true });
          chrome.tabs.update(
            tabInfo.id,
            { active: true, selected: true },
            (tab) => {
              if (!tab)
                chrome.tabs.create({
                  url: tabInfo.url,
                });
            }
          );
        });

        $searchResult.append(tabList);
      }
    });
  }, 300);
});

$tabCount.addEventListener("change", (event) => {
  const count = event.target.value;

  if (count < 5 || count > 25) {
    $tabCount.value = 8;
    setStorage({ tabCount: 8 });
    return;
  }

  setStorage({ tabCount: count });
});

async function showTabCount() {
  const tabCount = await getTabCount();
  $tabCount.value = tabCount;
}

async function getCurrentOnOff() {
  const { isOff } = await getOnOff();

  $onoff.checked = !isOff;
}

$onoff.addEventListener("click", () => {
  if (!$onoff.checked) {
    setStorage({ isOff: true });
    return;
  }

  setStorage({ isOff: false });
});

calculateChartData();

async function calculateChartData() {
  const tabs = await getAllTabs();

  if (tabs.length < 10) {
    $chartContainer.textContent = "아직 표시할 데이터가 없습니다!";
    return;
  }

  const tabObj = {};

  tabs.forEach((tab) => {
    const tabUrl = tab.url;
    const pattern = /\/\/([a-z0-9-_\.]*)[\/\?]/i;
    const url = tabUrl.match(pattern)[1];

    if (tabObj.hasOwnProperty(url)) {
      tabObj[url].number += 1;
    } else {
      tabObj[url] = { number: 1, favIconUrl: tab.favIconUrl };
    }
  });

  const urlArray = [];

  for (const prop in tabObj) {
    urlArray.push({
      url: prop,
      number: tabObj[prop].number,
      favIconUrl: tabObj[prop].favIconUrl,
    });
  }

  const sortedTab = urlArray.slice().sort((a, b) => b.number - a.number);
  const topFour = sortedTab.slice(0, 4);

  topFour.forEach((tab, i) => {
    const degree = Math.floor((tab.number / tabs.length) * 360);

    i > 0
      ? (tab.degree = topFour[i - 1].degree + degree)
      : (tab.degree = degree);
  });

  const color = ["#5185ec", "#d85140", "#f1be42", "#58a55c"];

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    ctx.font = "12px Sans-Serif";

    for (let i = 0; i < topFour.length; i++) {
      const calRadian1 = (topFour[i - 1]?.degree * Math.PI) / 180;
      const calRadian2 = (topFour[i].degree * Math.PI) / 180;

      ctx.beginPath();
      ctx.fillStyle = color[i];
      ctx.moveTo(centerX, centerY);

      i === 0
        ? ctx.arc(centerX, centerY, radius, 0, calRadian2, false)
        : ctx.arc(centerX, centerY, radius, calRadian1, calRadian2, false);

      ctx.closePath();
      ctx.fill();

      roundedRect(ctx, 10, 270 + i * 20, 10, 10, 4, color[i]);

      ctx.fillStyle = "black";
      ctx.fillText(topFour[i].url, 25, 280 + i * 20);

      if (i === topFour.length - 1) {
        ctx.beginPath();
        ctx.fillStyle = "#e9e9e7";
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          radius,
          calRadian2,
          (360 * Math.PI) / 180,
          false
        );
        ctx.closePath();
        ctx.fill();

        roundedRect(ctx, 10, 270 + (i + 1) * 20, 10, 10, 4, "#e9e9e7");
        ctx.fillStyle = "black";
        ctx.fillText("ETC", 25, 280 + (i + 1) * 20);
      }
    }

    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2, true);
    ctx.fill();

    function roundedRect(ctx, x, y, width, height, radius, color) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y + height, x + radius, y + height, radius);
      ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
      ctx.arcTo(x + width, y, x + width - radius, y, radius);
      ctx.arcTo(x, y, x, y + radius, radius);
      ctx.fill();
    }
  }
}
