/* Weekly timetable with level filter. Data: assets/data/schedule.js + levels.js */
(function () {
  "use strict";
  var B = window.Yaylish;
  var grid = document.getElementById("schedule-grid");
  if (!grid) return;
  var filters = document.getElementById("schedule-filters");
  var count = document.getElementById("schedule-count");
  var BORDER = { lvl1: "border-lvl1", lvl2: "border-lvl2", lvl3: "border-lvl3", lvl4: "border-lvl4", lvl5: "border-lvl5" };
  var params = new URLSearchParams(window.location.search);
  var selected = params.get("level") || "all";
  var levels = function () { return B.data.levels || []; };
  if (selected !== "all" && !levels().some(function (l) { return l.id === selected; })) selected = "all";

  function levelOf(id) { return levels().filter(function (l) { return l.id === id; })[0] || {}; }

  function renderFilters() {
    var items = [{ id: "all", label: B.t("schedule.all") }].concat(levels().map(function (l) { return { id: l.id, label: B.t("level." + l.id + ".name") }; }));
    filters.innerHTML = items.map(function (it) {
      return '<button type="button" class="chip" data-level="' + B.esc(it.id) + '" aria-pressed="' + (it.id === selected ? "true" : "false") + '">' + B.esc(it.label) + "</button>";
    }).join("");
  }

  function renderGrid() {
    var sched = B.data.schedule || { days: [], slots: [] };
    var total = 0;
    var rows = sched.days.map(function (d) {
      var slots = sched.slots.filter(function (s) { return s.day === d && (selected === "all" || s.level === selected); })
        .sort(function (a, b) { return a.start < b.start ? -1 : 1; });
      total += slots.length;
      var dayName = B.t("day." + d);
      var cards = slots.map(function (s) {
        var l = levelOf(s.level);
        var seats = s.seats != null && s.seats <= 3 ? '<span class="badge bg-coral/20 text-ink">' + B.esc(B.t("schedule.seats", { n: s.seats })) + "</span>" : "";
        var slotParam = encodeURIComponent(d + "|" + s.start);
        return '<li class="flex flex-col gap-1 rounded-2xl border-l-[10px] bg-white p-4 shadow-soft ring-1 ring-ink/5 ' + (BORDER[l.color] || "border-brand") + '">' +
          '<p class="flex items-center gap-2 text-lg font-extrabold tabular-nums text-ink">' + B.icon("clock", "h-4 w-4 text-muted") + B.esc(B.fmtTime(s.start)) + " – " + B.esc(B.fmtTime(s.end)) + "</p>" +
          '<p class="font-bold text-brand-dark">' + B.esc(B.t("level." + s.level + ".name")) + "</p>" +
          '<p class="text-sm text-muted">' + B.esc(B.t("schedule.room", { room: s.room })) + " · " + B.esc(B.t("level.ages", { min: l.ageMin, max: l.ageMax })) + "</p>" +
          '<div class="mt-2 flex flex-wrap items-center justify-between gap-2">' + seats +
          '<a class="ml-auto inline-flex min-h-[44px] items-center gap-1 rounded-btn px-3 text-sm font-bold text-brand-dark underline-offset-4 hover:bg-brand-soft hover:underline" href="book-trial.html?level=' + encodeURIComponent(s.level) + "&slot=" + slotParam + '">' +
          B.esc(B.t("schedule.book")) + '<span class="sr-only"> – ' + B.esc(dayName + " " + s.start) + "</span>" + B.icon("arrow-right", "h-4 w-4") + "</a></div></li>";
      }).join("");
      var body = slots.length ? '<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="' + B.esc(B.t("schedule.dayLabel", { day: dayName })) + '">' + cards + "</ul>"
        : '<p class="rounded-2xl border-2 border-dashed border-ink/15 px-4 py-4 text-sm text-muted">' + B.esc(B.t("schedule.none")) + "</p>";
      return '<div class="grid gap-3 border-t-2 border-ink/10 py-6 first:border-t-0 md:grid-cols-[120px_1fr] md:gap-6">' +
        '<h3 class="font-display text-2xl font-extrabold text-ink">' + B.esc(dayName) + "</h3>" + body + "</div>";
    }).join("");
    grid.innerHTML = rows;
    count.textContent = total === 1 ? B.t("schedule.count1") : B.t("schedule.count", { n: total });
  }

  filters.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-level]");
    if (!btn) return;
    selected = btn.getAttribute("data-level");
    var url = new URL(window.location.href);
    if (selected === "all") url.searchParams.delete("level"); else url.searchParams.set("level", selected);
    try { window.history.replaceState(null, "", url); } catch (err) {}
    filters.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    renderGrid();
  });

  B.mount(function () { renderFilters(); renderGrid(); });
})();
