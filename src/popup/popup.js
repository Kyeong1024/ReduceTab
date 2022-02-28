import "./style.css";

const $tabCount = document.getElementById("tab-count");
const $onoff = document.getElementById("on-off-switch");

const count = 8;
$tabCount.textContent = count;

$onoff.addEventListener("click", () => {
  console.log($onoff.checked);
});
