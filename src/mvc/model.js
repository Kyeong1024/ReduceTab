// const model = (function () {
//   return {
//     setOption: function (tabCount, sorting) {
//       chrome.storage.local.set({
//         tabCount,
//         sorting,
//       });
//     },
//     tabCount: function (resolve) {
//       chrome.storage.local.get(["tabCount"], (res) => {
//         resolve(res.tabCount ?? 8);
//       });
//     },
//   };
// })();

// export default model;
