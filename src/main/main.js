import "./style.css";
import { CURRENT } from "../constant";
import { deleteTab, tabList, search } from "../utils";

const $tabList = document.getElementById("tab-list");
const $trashcan = document.getElementById("trashcan");
const $searchInput = document.getElementById("search-input");
const $searchResult = document.getElementById("search-result");

const init = function () {
  search.init($searchInput, $searchResult, CURRENT);
  tabList.init($tabList);
  deleteTab.clickButton($trashcan, $tabList);
};

init();
