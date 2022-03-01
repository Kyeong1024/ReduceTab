import "./style.css";

const $tabCount = document.getElementById("tab-count");
const $onoff = document.getElementById("on-off-switch");

chrome.storage.local.get(["tabCount"], (res) => {
  $tabCount.textContent = "tabCount" in res ? res.tabCount : 8;
});

$onoff.addEventListener("click", () => {
  console.log($onoff.checked);
  if (!$onoff.checked) {
    // tab 제한 갯수를 무한으로 늘리거나 early return을 통해 작동 금지, 혹은 counting하는 것 비활성화 등드의 방법으로 할것
    // 찾아본 결과 해당 extension을 강제로 비활성화 하기는 힘듬.
  }
});
