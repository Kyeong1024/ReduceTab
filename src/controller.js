import model from "./model";
import { optionView } from "./view";

const controller = (function () {
  function saveOptions(tabCount, sorting) {
    let sortingName = "";

    sorting.forEach((element) => {
      if (element.checked) {
        sortingName = element.value;
      }
    });

    model.option(tabCount, sortingName);
  }

  function getTabCount(tabCount) {
    optionView.showTabCount(tabCount);
  }

  return {
    setTabCount: function () {
      optionView.setTabCount();
    },
    saveOption: function () {
      optionView.saveSetting(saveOptions);
    },
    sendTabCount: function () {
      model.tabCount(getTabCount);
    },
  };
})();

export default controller;
