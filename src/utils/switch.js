import { getCurrentOnOff, setStorage } from "../storage";
import { controlTab } from "./tab";

export const onoffSwitch = (function () {
  function controlSwitch(event) {
    event.target.checked
      ? setStorage({ isOff: false })
      : setStorage({ isOff: true });

    if (event.target.checked) {
      controlTab.remove();
    }
  }

  return {
    click: function (target) {
      this.getCurrentSwitch(target);
      target.addEventListener("click", controlSwitch);
    },
    getCurrentSwitch: async function (target) {
      const isOff = await getCurrentOnOff();
      target.checked = !isOff;
    },
  };
})();
