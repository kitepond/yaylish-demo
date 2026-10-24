/* Trial-class booking form: 3 steps, front-end validation, configurable submission.
   Submission provider is set in site.config.js -> form.provider ("none" | "formspree" | "netlify" | "custom").
   With provider "none" (default) NOTHING is sent anywhere – the form only validates and shows a demo panel. */
(function () {
  "use strict";
  var B = window.Yaylish;
  var form = document.getElementById("trial-form");
  if (!form) return;
  var fcfg = B.cfg.form || {};
  var steps = Array.prototype.slice.call(form.querySelectorAll("[data-step]"));
  var total = steps.length, cur = 0;
  var els = {
    indicator: document.getElementById("step-indicator"),
    bar: document.getElementById("step-bar"),
    back: document.getElementById("btn-back"),
    next: document.getElementById("btn-next"),
    send: document.getElementById("btn-send"),
    status: document.getElementById("form-status"),
    demo: document.getElementById("form-demo"),
    ok: document.getElementById("form-success"),
    fail: document.getElementById("form-fail"),
    slot: document.getElementById("slot-note")
  };
  var params = new URLSearchParams(window.location.search);
  var slotParam = params.get("slot") || "";

  var provider = fcfg.provider || "none";
  var needsEndpoint = provider === "formspree" || provider === "custom";
  var live = provider === "netlify" || (needsEndpoint && !!fcfg.endpoint);
  if (needsEndpoint && !fcfg.endpoint && window.console) console.warn("[Yaylish] form.provider is '" + provider + "' but form.endpoint is empty – running in demo mode (nothing is sent).");

  /* ----- populate selects (language aware) ----- */
  function populate() {
    var sel = form.elements.level, keep = sel.value || params.get("level") || "";
    sel.innerHTML = '<option value="">' + B.esc(B.t("book.levelUnsure")) + "</option>" + (B.data.levels || []).map(function (l) {
      return '<option value="' + l.id + '">' + B.esc(B.t("level." + l.id + ".name") + " (" + B.t("level.ages", { min: l.ageMin, max: l.ageMax }) + ")") + "</option>";
    }).join("");
    sel.value = keep;
    if (sel.value !== keep) sel.value = "";
    if (els.slot) {
      var p = slotParam.split("|");
      if (p.length === 2 && /^[a-z]{3}$/.test(p[0])) { els.slot.hidden = false; els.slot.textContent = B.t("book.slot", { slot: B.t("day." + p[0]) + " " + p[1] }); }
    }
    if (els.indicator) updateStepUi();
  }

  /* ----- steps ----- */
  function stepName(i) { return B.t("book.step" + (i + 1)); }
  function updateStepUi() {
    els.indicator.textContent = B.t("book.stepOf", { n: cur + 1, total: total, name: stepName(cur) });
    els.bar.style.width = ((cur + 1) / total * 100) + "%";
    els.bar.parentNode.setAttribute("aria-valuenow", cur + 1);
  }
  function show(i, focus) {
    cur = i;
    steps.forEach(function (s, idx) { s.hidden = idx !== i; });
    els.back.hidden = i === 0;
    els.next.hidden = i === total - 1;
    els.send.hidden = i !== total - 1;
    updateStepUi();
    if (focus) {
      var h = steps[i].querySelector("legend"); if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
    }
  }

  /* ----- validation ----- */
  function val(name) { return (form.elements[name].value || "").trim(); }
  function setError(name, msgKey) {
    var errEl = document.getElementById("err-" + name);
    var field = form.elements[name];
    var inputs = field && field.length && !field.tagName ? Array.prototype.slice.call(field) : [field];
    if (msgKey) {
      errEl.textContent = B.t(msgKey); errEl.hidden = false; errEl.dataset.key = msgKey;
      inputs.forEach(function (i) { i.setAttribute("aria-invalid", "true"); i.setAttribute("aria-describedby", "err-" + name); });
    } else {
      errEl.textContent = ""; errEl.hidden = true; delete errEl.dataset.key;
      inputs.forEach(function (i) { i.removeAttribute("aria-invalid"); i.removeAttribute("aria-describedby"); });
    }
  }
  var RULES = {
    childName: function () { return val("childName") ? "" : "book.v.required"; },
    childAge: function () { var n = Number(val("childAge")); return /^\d+$/.test(val("childAge")) && n >= 3 && n <= 15 ? "" : "book.v.age"; },
    days: function () { return form.querySelectorAll('input[name="days"]:checked').length ? "" : "book.v.days"; },
    parentName: function () { return val("parentName") ? "" : "book.v.required"; },
    phone: function () { var v = val("phone"); var digits = v.replace(/\D/g, ""); return /^\+?[0-9 .\-()]+$/.test(v) && digits.length >= 8 && digits.length <= 15 ? "" : "book.v.phone"; },
    email: function () {
      var v = val("email"), method = (form.querySelector('input[name="contactMethod"]:checked') || {}).value;
      if (!v) return method === "email" ? "book.v.emailNeeded" : "";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "book.v.email";
    },
    consent: function () { return form.elements.consent.checked ? "" : "book.v.consent"; }
  };
  var STEP_FIELDS = [["childName", "childAge"], ["days"], ["parentName", "phone", "email", "consent"]];

  function validateFields(names) {
    var first = null, n = 0;
    names.forEach(function (name) {
      var msg = RULES[name]();
      setError(name, msg);
      if (msg) { n++; if (!first) first = name; }
    });
    if (first) {
      var f = form.elements[first]; if (f.length && !f.tagName) f = f[0];
      f.focus();
      els.status.textContent = B.t("book.error.summary", { n: n });
    } else els.status.textContent = "";
    return !first;
  }

  // clear an error as soon as the user fixes the field
  form.addEventListener("input", function (e) {
    var name = e.target.name;
    if (RULES[name] && !document.getElementById("err-" + name).hidden && !RULES[name]()) setError(name, "");
  });
  form.addEventListener("change", function (e) {
    var name = e.target.name;
    if (name === "contactMethod" && !document.getElementById("err-email").hidden && !RULES.email()) setError("email", "");
    if (RULES[name] && !document.getElementById("err-" + name).hidden && !RULES[name]()) setError(name, "");
  });

  els.next.addEventListener("click", function () { if (validateFields(STEP_FIELDS[cur])) show(cur + 1, true); });
  els.back.addEventListener("click", function () { show(cur - 1, true); });

  /* ----- payload ----- */
  function collect() {
    var days = Array.prototype.map.call(form.querySelectorAll('input[name="days"]:checked'), function (i) { return i.value; });
    var radio = function (n) { var r = form.querySelector('input[name="' + n + '"]:checked'); return r ? r.value : ""; };
    return {
      childName: val("childName"), childAge: val("childAge"), level: val("level"), experience: radio("experience"),
      days: days.join(", "), time: radio("time"), start: val("start"),
      parentName: val("parentName"), phone: val("phone"), email: val("email"), contactMethod: radio("contactMethod"),
      message: val("message"), selectedSlot: slotParam, language: B.lang(), consent: "yes", source: window.location.href
    };
  }
  function summaryText(d) {
    return ["Child: " + d.childName + " (" + d.childAge + ")", "Level: " + (d.level || "not sure"), "Experience: " + d.experience,
      "Days: " + d.days, "Time: " + d.time, "Start: " + d.start,
      "Parent: " + d.parentName, "Phone/Zalo: " + d.phone, "Email: " + d.email, "Contact via: " + d.contactMethod,
      d.selectedSlot ? "Slot: " + d.selectedSlot : "", "Message: " + d.message].filter(Boolean).join("\n");
  }

  /* ----- submit ----- */
  function panel(which) {
    form.hidden = true;
    [els.demo, els.ok, els.fail].forEach(function (p) { p.hidden = p !== which; });
    which.setAttribute("tabindex", "-1");
    which.scrollIntoView({ behavior: "smooth", block: "start" });
    which.focus({ preventScroll: true });
  }
  function demoPanel(d) {
    var box = document.getElementById("demo-actions");
    var acts = [];
    var subject = encodeURIComponent(B.t("book.mail.subject", { child: d.childName }));
    if (fcfg.fallbackEmail) acts.push('<a class="btn btn-secondary" href="mailto:' + B.esc(fcfg.fallbackEmail) + "?subject=" + subject + "&body=" + encodeURIComponent(summaryText(d)) + '">' + B.icon("mail", "h-5 w-5") + B.esc(B.t("book.demo.email")) + "</a>");
    if (B.cfg.contact && B.cfg.contact.zalo) acts.push('<a class="btn btn-outline" target="_blank" rel="noopener noreferrer" href="https://zalo.me/' + B.esc(B.cfg.contact.zalo) + '">' + B.icon("message", "h-5 w-5") + "Zalo</a>");
    box.innerHTML = acts.join("");
    document.getElementById("demo-summary").textContent = summaryText(d);
    panel(els.demo);
  }
  function setBusy(b) {
    els.send.disabled = b;
    els.send.querySelector("span").textContent = B.t(b ? "common.sending" : "common.send");
  }
  function postJson(url, d) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); });
  }
  function postNetlify(d) {
    var body = new URLSearchParams(Object.assign({ "form-name": fcfg.netlifyFormName || "trial-booking" }, d)).toString();
    return fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.elements.website && form.elements.website.value) return; // honeypot: bots only
    var all = STEP_FIELDS.reduce(function (a, b) { return a.concat(b); }, []);
    // validate step by step so we can jump to the first step with an error
    for (var i = 0; i < STEP_FIELDS.length; i++) {
      var bad = STEP_FIELDS[i].some(function (n) { return RULES[n](); });
      if (bad) { show(i, false); validateFields(STEP_FIELDS[i]); return; }
    }
    all.forEach(function (n) { setError(n, ""); });
    var d = collect();
    if (!live) { demoPanel(d); return; }
    setBusy(true);
    var req = provider === "netlify" ? postNetlify(d) : postJson(fcfg.endpoint, d);
    req.then(function () {
      if (fcfg.redirectAfterSuccess) { window.location.href = fcfg.redirectAfterSuccess; return; }
      panel(els.ok);
    }).catch(function (err) {
      if (window.console) console.error("[Yaylish] form submit failed:", err);
      setBusy(false);
      panel(els.fail);
    });
  });

  document.querySelectorAll("[data-form-reset]").forEach(function (b) {
    b.addEventListener("click", function () {
      [els.demo, els.ok, els.fail].forEach(function (p) { p.hidden = true; });
      form.hidden = false; setBusy(false); show(0, true);
    });
  });

  // Calendly / external scheduler link
  var cal = document.getElementById("calendly-box");
  if (cal) { if (fcfg.calendlyUrl) { cal.hidden = false; cal.querySelector("a").href = fcfg.calendlyUrl; } else cal.hidden = true; }
  // fail panel contact links
  var failLinks = document.getElementById("fail-links");
  if (failLinks) {
    var c = B.cfg.contact || {};
    failLinks.innerHTML = (c.hotline ? '<a class="btn btn-secondary" href="tel:' + B.esc(c.hotline) + '">' + B.icon("phone", "h-5 w-5") + B.esc(c.hotlineDisplay || c.hotline) + "</a>" : "") +
      (c.zalo ? '<a class="btn btn-outline" target="_blank" rel="noopener noreferrer" href="https://zalo.me/' + B.esc(c.zalo) + '">Zalo</a>' : "");
  }

  // prefill from URL
  if (params.get("level") && form.elements.level) form.elements.level.value = params.get("level");

  B.mount(populate);
  show(0, false);
  setBusy(false);
})();
