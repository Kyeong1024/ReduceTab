export const chart = (function () {
  return {
    init: async function (target, tabList, center) {
      const rankList = this.calculateTabCount(tabList);
      const chartData = this.calculateDegree(rankList, tabList.length);

      this.drawChart(chartData, target, center);
    },
    calculateTabCount: function (tabList) {
      const tabs = tabList;
      const tabObj = {};

      if (tabs.length < 10) return [];

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

      return rankData;
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
    calculateDegree: function (list, allTabsLength) {
      list.forEach((info, i) => {
        const degree = Math.floor((info.number / allTabsLength) * 360);

        i > 0
          ? (info.degree = list[i - 1].degree + degree)
          : (info.degree = degree);
      });

      return list;
    },
    drawChart: function (chartData, target, position) {
      const color = ["#5185ec", "#d85140", "#f1be42", "#58a55c", "#e9e9e7"];
      chartData.push({ degree: 360, url: "etc" });

      if (target.getContext) {
        const ctx = target.getContext("2d");
        const centerX = position.chartCenter;
        const centerY = position.chartCenter;
        const rectX = position.rectX;
        const rectY = position.rectY;
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

          this.roundedRect(ctx, 10, rectX + i * 20, rectY, 10, 4, color[i]);

          ctx.fillStyle = "black";
          ctx.fillText(chartData[i].url, 25, rectX + 10 + i * 20);
        }

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(centerX, centerY, centerX * 0.4, 0, Math.PI * 2, true);
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
