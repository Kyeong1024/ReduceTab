import { getTabCount } from "./storage";

export async function showTabCount(target, prop) {
  //삭제요망
  const tabCount = await getTabCount();
  target[prop] = tabCount;
}
