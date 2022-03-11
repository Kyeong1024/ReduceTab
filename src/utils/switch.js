import { getCurrentOnOff, setStorage } from "../storage";
import { controlTab } from "./tab";

export const onoffSwitch = {
  click: function (target) {
    this.getCurrentSwitch(target);
    this.controlSwitch(target);
  },
  getCurrentSwitch: async function (target) {
    const isOff = await getCurrentOnOff();
    target.checked = !isOff;
  },
  controlSwitch: function (target) {
    target.addEventListener("click", this.saveSwitchState);
  },
  saveSwitchState: function (event) {
    event.target.checked
      ? setStorage({ isOff: false })
      : setStorage({ isOff: true });

    if (event.target.checked) {
      controlTab.remove();
    }
  },
};
