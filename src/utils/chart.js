export const chart = (function () {
  const color = ["#5185ec", "#d85140", "#f1be42", "#58a55c"];
  let chartData = [];

  return {
    init: async function (target, tabList) {
      await this.calculateTabCount(tabList);
      this.makeChart(chartData, target);
    },
    calculateTabCount: async function (tabList) {
      const tabs = tabList;
      const tabObj = {};

      if (tabs.length < 10) return;

      tabs.forEach((tab) => {
        const tabUrl = tab.url;
        const pattern = /\/\/([a-z0-9-_\.]*)[\/\?]/i;
        const result = tabUrl.match(pattern);

        if (!result) return;

        const url = result[1];

        if (tabObj.hasOwnProperty(url)) {
          tabObj[url].number += 1;
        } else {
          tabObj[url] = { number: 1, favIconUrl: tab.favIconUrl };
        }
      });

      const rankData = this.reArrangeObj(tabObj, 4);
      const allTabsCount = tabs.length;

      chartData = this.addDegree(rankData, allTabsCount);
    },
    reArrangeObj: function (tabObj, rankNumber) {
      const result = [];

      for (const prop in tabObj) {
        result.push({
          url: prop,
          number: tabObj[prop].number,
          favIconUrl: tabObj[prop].favIconUrl,
        });
      }

      return result
        .slice()
        .sort((a, b) => b.number - a.number)
        .slice(0, rankNumber);
    },
    addDegree: function (list, allTabsLength) {
      list.forEach((info, i) => {
        const degree = Math.floor((info.number / allTabsLength) * 360);

        i > 0
          ? (info.degree = list[i - 1].degree + degree)
          : (info.degree = degree);
      });

      return list;
    },
    makeChart: function (chartData, target) {
      if (target.getContext) {
        const ctx = target.getContext("2d");

        const centerX = 150;
        const centerY = 150;
        const radius = 100;
        ctx.font = "12px Sans-Serif";

        for (let i = 0; i < chartData.length; i++) {
          const calRadian1 = (chartData[i - 1]?.degree * Math.PI) / 180;
          const calRadian2 = (chartData[i].degree * Math.PI) / 180;

          ctx.beginPath();
          ctx.fillStyle = color[i];
          ctx.moveTo(centerX, centerY);

          i === 0
            ? ctx.arc(centerX, centerY, radius, 0, calRadian2, false)
            : ctx.arc(centerX, centerY, radius, calRadian1, calRadian2, false);

          ctx.closePath();
          ctx.fill();

          this.roundedRect(ctx, 10, 270 + i * 20, 10, 10, 4, color[i]);

          ctx.fillStyle = "black";
          ctx.fillText(chartData[i].url, 25, 280 + i * 20);

          if (i === chartData.length - 1) {
            ctx.beginPath();
            ctx.fillStyle = "#e9e9e7";
            ctx.moveTo(centerX, centerY);
            ctx.arc(
              centerX,
              centerY,
              radius,
              calRadian2,
              (360 * Math.PI) / 180,
              false
            );
            ctx.closePath();
            ctx.fill();

            this.roundedRect(ctx, 10, 270 + (i + 1) * 20, 10, 10, 4, "#e9e9e7");
            ctx.fillStyle = "black";
            ctx.fillText("ETC", 25, 280 + (i + 1) * 20);
          }
        }

        ctx.beginPath();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.arc(centerX, centerY, 60, 0, Math.PI * 2, true);
        ctx.fill();
      }
    },
    roundedRect: function (ctx, x, y, width, height, radius, color) {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.moveTo(x, y + radius);
      ctx.arcTo(x, y + height, x + radius, y + height, radius);
      ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
      ctx.arcTo(x + width, y, x + width - radius, y, radius);
      ctx.arcTo(x, y, x, y + radius, radius);
      ctx.fill();
    },
  };
})();
