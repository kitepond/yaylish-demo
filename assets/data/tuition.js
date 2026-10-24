/* Tuition data. Edit prices here – no other file needs changing.
   - monthly: price for one month, per currency (add any currency code you use in site.config.js).
   - sessionsPerMonth: used to show the price per session.
   - plans: "term" and "package" are calculated from the monthly price:
       months   = how many months are paid up-front
       discount = % saved vs paying monthly (0.05 = 5%)
   - rounding: rounds calculated prices (VND to nearest 10,000, USD to whole dollars).
   ALL NUMBERS ARE SAMPLE VALUES. */
window.YAYLISH_DATA = window.YAYLISH_DATA || {};
window.YAYLISH_DATA.tuition = {
  plans: [
    { id: "monthly", months: 1, discount: 0 },
    { id: "term",    months: 3, discount: 0.05 },
    { id: "package", months: 6, discount: 0.10 }
  ],
  defaultPlan: "monthly",
  rounding: { VND: 10000, USD: 1, EUR: 1, GBP: 1 },
  levels: {
    "pre-starters": { sessionsPerMonth: 8, monthly: { VND: 1500000, USD: 59 } },
    "starters":     { sessionsPerMonth: 8, monthly: { VND: 1700000, USD: 67 } },
    "movers":       { sessionsPerMonth: 8, monthly: { VND: 1900000, USD: 75 } },
    "flyers":       { sessionsPerMonth: 8, monthly: { VND: 2100000, USD: 83 } },
    "ielts-junior": { sessionsPerMonth: 8, monthly: { VND: 2600000, USD: 103 } }
  }
};
