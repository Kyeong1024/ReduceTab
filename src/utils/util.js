import { getTabCount } from "./storage";

export async function showTabCount(target, prop) {
  const tabCount = await getTabCount();
  target[prop] = tabCount;
}
