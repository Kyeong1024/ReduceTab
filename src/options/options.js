import "./style.css";
import { setStorage } from "../utils/storage";
import { showTabCount } from "../utils/util";

const $countOption = document.getElementById("count-number");
const $saveBtn = document.getElementById("save-button");
const $sorting = document.querySelectorAll("#sorting");

showTabCount($countOption, "value");

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

  const option = {
    tabCount,
    sorting,
  };

  setStorage(option);
});
