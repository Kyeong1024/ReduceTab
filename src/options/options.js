import "./style.css";

const $countOption = document.getElementById("count-number");
const $saveBtn = document.getElementById("save-button");
const $sorting = document.querySelectorAll("#sorting");

$countOption.addEventListener("change", (event) => {
  const number = event.target.value;

  if (number < 5 || number > 25) {
    $countOption.value = 8;
  }
});

$saveBtn.addEventListener("click", () => {
  const tabCount = $countOption.value;
  let sorting = "";

  $sorting.forEach((sortName) => {
    if (sortName.checked) {
      sorting = sortName.value;
    }
  });

  chrome.storage.local.set({
    tabCount,
    sorting,
  });
});
