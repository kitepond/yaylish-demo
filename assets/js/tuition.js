/* Tuition table (monthly / term / package toggle) and payment block. Data: assets/data/tuition.js */
(function () {
  "use strict";
  var B = window.Yaylish;
  var toggle = document.getElementById("tuition-toggle");
  if (!toggle) return;
  var tableHost = document.getElementById("tuition-table");
  var desc = document.getElementById("tuition-plan-desc");
  var payHost = document.getElementById("payment-block");
  var D = function () { return B.data.tuition; };
  var plan = D().defaultPlan || "monthly";

  function round(v, cur) { var r = (D().rounding || {})[cur] || 1; return Math.round(v / r) * r; }
  function monthlyOf(levelId) {
    var m = D().levels[levelId].monthly, cur = B.currency();
    if (m[cur] == null) { cur = Object.keys(m)[0]; }
    return { value: m[cur], cur: cur };
  }
  function calc(levelId, p) {
    var m = monthlyOf(levelId), sessions = D().levels[levelId].sessionsPerMonth * p.months;
    var total = round(m.value * p.months * (1 - p.discount), m.cur);
    var perUnit = m.cur === "VND" ? 1000 : 0.01;
    var per = Math.round(total / sessions / perUnit) * perUnit;
    return { total: total, cur: m.cur, sessions: sessions, per: per, perDigits: m.cur === "VND" ? 0 : 2 };
  }
  function current() { return D().plans.filter(function (p) { return p.id === plan; })[0] || D().plans[0]; }
  function levels() { return B.data.levels || []; }

  function renderToggle() {
    toggle.innerHTML = D().plans.map(function (p) {
      return '<button type="button" role="radio" class="chip" data-plan="' + p.id + '" aria-checked="' + (p.id === plan ? "true" : "false") + '" tabindex="' + (p.id === plan ? "0" : "-1") + '">' +
        B.esc(B.t("tuition.plan." + p.id)) + (p.discount ? ' <span class="rounded-btn bg-accent px-2 py-0.5 text-xs font-extrabold text-ink">−' + Math.round(p.discount * 100) + "%</span>" : "") + "</button>";
    }).join("");
  }

  function renderTable() {
    var p = current();
    var sessionsNote = D().levels[levels()[0].id].sessionsPerMonth * p.months;
    desc.textContent = B.t("tuition.plan." + p.id + ".desc", { n: sessionsNote, pct: Math.round(p.discount * 100) });
    var perKey = B.t("tuition.per." + p.id);
    var rows = levels().map(function (l) {
      var c = calc(l.id, p);
      return '<tr class="border-t border-ink/10">' +
        '<th scope="row" class="py-4 pl-6 pr-3 text-left"><span class="flex items-center gap-3"><span class="h-4 w-4 rounded-full ' + (B.levelDot[l.color] || "bg-brand") + '"></span><span class="font-display text-lg font-bold">' + B.esc(B.t("level." + l.id + ".name")) + "</span></span></th>" +
        '<td class="px-3 py-4 text-muted">' + B.esc(B.t("level.ages", { min: l.ageMin, max: l.ageMax })) + "</td>" +
        '<td class="px-3 py-4 text-muted">' + B.esc(B.t("tuition.classesCount", { n: c.sessions })) + "</td>" +
        '<td class="px-3 py-4"><span class="text-xl font-extrabold text-ink">' + B.esc(B.fmtMoney(c.total, c.cur)) + '</span> <span class="text-sm text-muted">' + B.esc(perKey) + "</span></td>" +
        '<td class="py-4 pl-3 pr-6 text-muted tabular-nums">' + B.esc(B.t("tuition.perClass", { price: B.fmtMoney(c.per, c.cur, c.perDigits) })) + "</td></tr>";
    }).join("");
    var cards = levels().map(function (l) {
      var c = calc(l.id, p);
      return '<li class="card !p-5"><div class="flex items-start justify-between gap-3"><div>' +
        '<p class="flex items-center gap-2 font-display text-xl font-bold"><span class="h-3.5 w-3.5 rounded-full ' + (B.levelDot[l.color] || "bg-brand") + '"></span>' + B.esc(B.t("level." + l.id + ".name")) + "</p>" +
        '<p class="mt-1 text-sm text-muted">' + B.esc(B.t("level.ages", { min: l.ageMin, max: l.ageMax })) + " · " + B.esc(B.t("tuition.classesCount", { n: c.sessions })) + "</p></div>" +
        '<div class="text-right"><p class="text-xl font-extrabold">' + B.esc(B.fmtMoney(c.total, c.cur)) + '</p><p class="text-xs text-muted">' + B.esc(perKey) + "</p></div></div>" +
        '<p class="mt-2 text-sm font-bold text-brand-dark">' + B.esc(B.t("tuition.perClass", { price: B.fmtMoney(c.per, c.cur, c.perDigits) })) + "</p></li>";
    }).join("");
    tableHost.innerHTML =
      '<div class="hidden overflow-hidden rounded-card bg-surface shadow-soft ring-1 ring-ink/5 md:block"><table class="w-full text-left">' +
      '<caption class="sr-only">' + B.esc(B.t("tuition.table.caption")) + "</caption>" +
      '<thead class="bg-brand-soft text-sm text-brand-dark"><tr><th scope="col" class="py-3 pl-6 pr-3">' + B.esc(B.t("tuition.col.level")) + '</th><th scope="col" class="px-3 py-3">' + B.esc(B.t("tuition.col.age")) +
      '</th><th scope="col" class="px-3 py-3">' + B.esc(B.t("tuition.col.classes")) + '</th><th scope="col" class="px-3 py-3">' + B.esc(B.t("tuition.col.price")) + '</th><th scope="col" class="py-3 pl-3 pr-6">' + B.esc(B.t("tuition.col.per")) + "</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>" +
      '<ul class="space-y-3 md:hidden">' + cards + "</ul>";
  }

  function renderPayment() {
    var pay = B.cfg.payment;
    if (!payHost) return;
    if (!pay || !pay.show) { payHost.hidden = true; return; }
    payHost.hidden = false;
    function row(labelKey, value) {
      return '<div class="flex items-center justify-between gap-3 border-b border-ink/10 py-3 last:border-0"><div class="min-w-0"><div class="text-sm text-muted">' + B.esc(B.t(labelKey)) + '</div><div class="break-words font-bold text-ink">' + B.esc(value) + "</div></div>" +
        '<button type="button" class="btn btn-ghost !min-h-[44px] !px-3 !py-2 text-sm" data-copy="' + B.esc(value) + '">' + B.icon("copy", "h-4 w-4") + '<span>' + B.esc(B.t("common.copy")) + "</span></button></div>";
    }
    payHost.innerHTML =
      '<div class="grid items-center gap-8 md:grid-cols-[1fr_240px]"><div>' +
      '<h2 class="text-2xl sm:text-3xl">' + B.esc(B.t("tuition.pay.title")) + "</h2>" +
      '<p class="mt-3 text-muted">' + B.esc(B.t("tuition.pay.text")) + "</p>" +
      (pay.isPlaceholder ? '<p class="mt-4 flex gap-2 rounded-2xl bg-accent/30 p-3 text-sm font-bold text-ink" role="note">' + B.icon("alert", "mt-0.5 h-5 w-5 shrink-0") + "<span>" + B.esc(B.t("tuition.pay.placeholder")) + "</span></p>" : "") +
      '<div class="mt-4">' + row("tuition.pay.bank", pay.bankName) + row("tuition.pay.name", pay.accountName) + row("tuition.pay.number", pay.accountNumber) + row("tuition.pay.note", pay.transferNote) + "</div>" +
      '<p class="mt-3 text-sm text-muted">' + B.esc(B.t("tuition.pay.intl")) + '</p><p class="sr-only" role="status" id="copy-status"></p></div>' +
      '<figure class="mx-auto text-center"><img src="' + B.esc(pay.qrImage) + '" alt="' + B.esc(B.t("tuition.pay.qrAlt")) + '" width="240" height="240" class="h-60 w-60 rounded-3xl bg-white p-3 ring-2 ring-ink/10" />' +
      '<figcaption class="mt-2 text-sm text-muted">' + B.esc(B.t("tuition.pay.qrCaption")) + "</figcaption></figure></div>";
  }

  toggle.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-plan]");
    if (!btn) return;
    plan = btn.getAttribute("data-plan");
    renderToggle(); renderTable();
    var nb = toggle.querySelector('[data-plan="' + plan + '"]'); if (nb) nb.focus();
  });
  toggle.addEventListener("keydown", function (e) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!keys[e.key]) return;
    e.preventDefault();
    var ids = D().plans.map(function (p) { return p.id; });
    plan = ids[(ids.indexOf(plan) + keys[e.key] + ids.length) % ids.length];
    renderToggle(); renderTable();
    toggle.querySelector('[data-plan="' + plan + '"]').focus();
  });
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var val = btn.getAttribute("data-copy");
    var done = function () {
      var span = btn.querySelector("span"), old = B.t("common.copy");
      span.textContent = B.t("common.copied");
      var st = document.getElementById("copy-status"); if (st) st.textContent = B.t("common.copied");
      setTimeout(function () { span.textContent = old; if (st) st.textContent = ""; }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(val).then(done, function () {});
    else {
      var ta = document.createElement("textarea"); ta.value = val; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (err) {} document.body.removeChild(ta);
    }
  });

  B.mount(function () { renderToggle(); renderTable(); renderPayment(); });
})();
