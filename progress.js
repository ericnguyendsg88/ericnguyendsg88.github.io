(function () {
  var data = window.PROGRESS;
  if (!data) return;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function level(n) { return n === 0 ? 0 : n <= 3 ? 1 : n <= 10 ? 2 : n <= 30 ? 3 : 4; }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function fmt(n) { return n.toLocaleString("en-US"); }

  // Heatmap: one column per week, Sunday at the top.
  var heat = document.getElementById("heat");
  var months = document.getElementById("heat-months");
  if (!heat || !months) return;
  var day = new Date(data.start + "T00:00:00");
  var end = new Date(data.asOf + "T00:00:00");
  var cells = [], labels = [], week = 0, lastMonth = -1, total = 0, active = 0;
  while (day <= end) {
    var key = iso(day), n = data.days[key] || 0;
    total += n; if (n) active++;
    if (day.getDay() === 0) {
      if (day.getMonth() !== lastMonth) { labels.push({ col: week + 1, text: MONTHS[day.getMonth()] }); lastMonth = day.getMonth(); }
      week++;
    }
    var label = n ? n + (n === 1 ? " commit" : " commits") + " on " + day.toDateString().slice(4) : "No commits on " + day.toDateString().slice(4);
    cells.push('<i class="l' + level(n) + '" title="' + label + '"></i>');
    day.setDate(day.getDate() + 1);
  }
  heat.style.gridTemplateColumns = "repeat(" + week + ", var(--cell))";
  months.style.gridTemplateColumns = "repeat(" + week + ", var(--cell))";
  heat.innerHTML = cells.join("");
  // Skip a month label when the next one starts less than three weeks later.
  months.innerHTML = labels.filter(function (l, i) {
    return !labels[i + 1] || labels[i + 1].col - l.col >= 3;
  }).map(function (l) {
    return '<span style="grid-column:' + l.col + '">' + l.text + '</span>';
  }).join("");
  heat.setAttribute("aria-label", fmt(total) + " commits on " + active + " days in the last 12 months");
  var totalEl = document.getElementById("p-total"), daysEl = document.getElementById("p-days");
  if (totalEl) totalEl.textContent = fmt(total);
  if (daysEl) daysEl.textContent = active;
  var scroller = document.querySelector(".heat-wrap");
  if (scroller) scroller.scrollLeft = scroller.scrollWidth;

  // SnipCam month bars.
  var bars = document.getElementById("snip-bars");
  if (!bars) return;
  var keys = Object.keys(data.snipMonths);
  var max = Math.max.apply(null, keys.map(function (k) { return data.snipMonths[k]; }));
  bars.innerHTML = keys.map(function (k) {
    var v = data.snipMonths[k];
    return '<div><b>' + v + '</b><i style="height:' + Math.max(6, Math.round(v / max * 100)) + '%"></i><span>' + MONTHS[+k.slice(5) - 1] + '</span></div>';
  }).join("");
})();
