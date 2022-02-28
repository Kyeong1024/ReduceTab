import "./style.css";

const $countOption = document.getElementById("count-number");

$countOption.addEventListener("change", (event) => {
  const number = event.target.value;

  if (number < 5 || number > 25) {
    $countOption.value = 5;
  }
});
