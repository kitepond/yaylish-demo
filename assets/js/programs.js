/* Renders level cards: #levels-preview (home, compact) and #levels-list (programs page, detailed). */
(function () {
  "use strict";
  var B = window.Yaylish;
  var TINT = B.levelTint;

  function levels() { return (B.data.levels || []); }
  function ages(l) { return B.t("level.ages", { min: l.ageMin, max: l.ageMax }); }

  function compact(l) {
    return '<a href="programs.html#' + l.id + '" class="card group flex h-full flex-col !p-5 transition hover:-translate-y-1 hover:shadow-pop">' +
      '<span class="flex h-36 items-center justify-center rounded-2xl ' + (TINT[l.color] || "bg-brand-soft") + '"><img src="' + B.esc(l.icon) + '" alt="" width="112" height="112" class="h-28 w-28 transition group-hover:scale-105" loading="lazy" /></span>' +
      '<span class="mt-4 inline-flex w-fit rounded-btn bg-brand-soft px-3 py-1 text-xs font-bold text-brand-dark">' + B.esc(ages(l)) + "</span>" +
      '<h3 class="mt-2 text-xl">' + B.esc(B.t("level." + l.id + ".name")) + "</h3>" +
      '<p class="mt-1 flex-1 text-[15px] text-muted">' + B.esc(B.t("level." + l.id + ".tagline")) + "</p>" +
      '<span class="mt-3 text-sm font-bold text-ink">' + B.esc(B.t("level.minutes", { n: l.minutes })) + "</span></a>";
  }

  function detailed(l, i) {
    var outs = "";
    for (var n = 1; n <= l.outcomes; n++) outs += "<li>" + B.esc(B.t("level." + l.id + ".o" + n)) + "</li>";
    var badge = "inline-flex items-center gap-1.5 rounded-btn bg-white px-3 py-1.5 text-sm font-bold text-ink ring-1 ring-ink/10";
    return '<article id="' + l.id + '" class="card grid scroll-mt-28 gap-6 md:grid-cols-[240px_1fr] md:gap-10">' +
      '<div class="flex items-center justify-center rounded-3xl p-6 ' + (TINT[l.color] || "bg-brand-soft") + '"><img src="' + B.esc(l.icon) + '" alt="" width="176" height="176" class="h-40 w-40 md:h-44 md:w-44" loading="lazy" /></div>' +
      "<div>" +
        '<p class="text-sm font-bold uppercase tracking-wide text-brand-dark">' + B.esc(B.t("programs.level", { n: i + 1 })) + "</p>" +
        '<h2 class="mt-1 text-3xl">' + B.esc(B.t("level." + l.id + ".name")) + "</h2>" +
        '<p class="mt-1 text-lg font-bold text-brand-dark">' + B.esc(B.t("level." + l.id + ".tagline")) + "</p>" +
        '<p class="mt-3 text-muted">' + B.esc(B.t("level." + l.id + ".desc")) + "</p>" +
        '<ul class="mt-4 flex flex-wrap gap-2">' +
          '<li class="' + badge + '">' + B.icon("smile", "h-4 w-4") + B.esc(ages(l)) + "</li>" +
          '<li class="' + badge + '">' + B.icon("calendar", "h-4 w-4") + B.esc(B.t("level.sessions", { n: l.sessionsPerWeek })) + "</li>" +
          '<li class="' + badge + '">' + B.icon("clock", "h-4 w-4") + B.esc(B.t("level.minutes", { n: l.minutes })) + "</li>" +
          '<li class="' + badge + '">' + B.icon("users", "h-4 w-4") + B.esc(B.t("level.classSize", { n: l.classSize })) + "</li></ul>" +
        '<h3 class="mt-6 text-lg">' + B.esc(B.t("level.outcomes")) + "</h3>" +
        '<ul class="prose-list mt-2 space-y-2 text-ink">' + outs + "</ul>" +
        '<div class="mt-6 flex flex-wrap gap-3">' +
          '<a class="btn btn-primary" href="book-trial.html?level=' + encodeURIComponent(l.id) + '">' + B.esc(B.t("programs.cta")) + "</a>" +
          '<a class="btn btn-outline" href="schedule.html?level=' + encodeURIComponent(l.id) + '">' + B.esc(B.t("common.viewSchedule")) + "</a></div>" +
      "</div></article>";
  }

  B.mount(function () {
    var a = document.getElementById("levels-preview");
    if (a) a.innerHTML = levels().map(compact).join("");
    var b = document.getElementById("levels-list");
    if (b) b.innerHTML = levels().map(detailed).join("");
  });
})();
