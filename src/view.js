const optionView = (function () {
  const $countOption = document.getElementById("count-number");
  const $saveBtn = document.getElementById("save-button");
  const $sorting = document.querySelectorAll("#sorting");

  return {
    showTabCount: function (tabCount) {
      $countOption.value = tabCount;
    },
    setTabCount: function () {
      $countOption.addEventListener("change", (event) => {
        const number = event.target.value;

        if (number < 5 || number > 25) {
          $countOption.value = 8;
        }
      });
    },
    saveSetting: function (saveOptions) {
      $saveBtn.addEventListener("click", () => {
        const tabCount = $countOption.value;

        saveOptions(tabCount, $sorting);
      });
    },
  };
})();

const popupView = (function () {
  const $tabCount = document.getElementById("tab-count");
  const $onoff = document.getElementById("on-off-switch");
})();

export { optionView };
