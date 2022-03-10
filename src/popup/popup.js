import "./style.css";
import { onoffSwitch, tabCount, search, chart } from "../utils";
import { ALL } from "../constant";
import { getAllTabs } from "../storage";

const $tabCount = document.getElementById("tab-count");
const $onoffSwitch = document.getElementById("on-off-switch");
const $searchInput = document.getElementById("search-input");
const $searchResult = document.getElementById("search-result");
const $canvas = document.getElementById("chart");

const popup = (function () {
  return {
    init: async function () {
      const tabList = await getAllTabs();

      tabCount.init($tabCount);
      onoffSwitch.click($onoffSwitch);
      search.init($searchInput, $searchResult, ALL);
      chart.init($canvas, tabList);
    },
  };
})();

popup.init();
