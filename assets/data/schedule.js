/* Weekly timetable data. One object per class session. Edit freely.
   day: mon | tue | wed | thu | fri | sat | sun     start/end: 24h "HH:MM"
   level: must match an id in assets/data/levels.js    room: free text
   seats (optional): number of seats left; show a "Few seats left" badge when <= 3. SAMPLE DATA. */
window.YAYLISH_DATA = window.YAYLISH_DATA || {};
window.YAYLISH_DATA.schedule = {
  days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
  slots: [
    { day: "mon", start: "16:30", end: "17:30", level: "pre-starters", room: "A1" },
    { day: "wed", start: "16:30", end: "17:30", level: "pre-starters", room: "A1" },
    { day: "tue", start: "16:30", end: "17:30", level: "pre-starters", room: "A2" },
    { day: "thu", start: "16:30", end: "17:30", level: "pre-starters", room: "A2", seats: 2 },
    { day: "mon", start: "17:45", end: "18:45", level: "starters", room: "A2" },
    { day: "wed", start: "17:45", end: "18:45", level: "starters", room: "A2" },
    { day: "tue", start: "17:45", end: "18:45", level: "starters", room: "B1" },
    { day: "thu", start: "17:45", end: "18:45", level: "starters", room: "B1" },
    { day: "mon", start: "17:30", end: "18:45", level: "movers", room: "B1" },
    { day: "wed", start: "17:30", end: "18:45", level: "movers", room: "B1", seats: 2 },
    { day: "tue", start: "17:30", end: "18:45", level: "movers", room: "B2" },
    { day: "thu", start: "17:30", end: "18:45", level: "movers", room: "B2" },
    { day: "tue", start: "18:00", end: "19:30", level: "flyers", room: "C1" },
    { day: "thu", start: "18:00", end: "19:30", level: "flyers", room: "C1" },
    { day: "mon", start: "18:00", end: "19:30", level: "flyers", room: "C2" },
    { day: "fri", start: "18:00", end: "19:30", level: "flyers", room: "C2" },
    { day: "mon", start: "19:00", end: "20:30", level: "ielts-junior", room: "C1" },
    { day: "wed", start: "19:00", end: "20:30", level: "ielts-junior", room: "C1", seats: 2 },
    { day: "fri", start: "17:30", end: "19:00", level: "ielts-junior", room: "C1" },
    { day: "sat", start: "08:30", end: "09:30", level: "pre-starters", room: "A1" },
    { day: "sat", start: "09:45", end: "10:45", level: "starters", room: "A1" },
    { day: "sat", start: "09:00", end: "10:15", level: "movers", room: "B1" },
    { day: "sat", start: "10:30", end: "12:00", level: "flyers", room: "B1" },
    { day: "sat", start: "13:30", end: "15:00", level: "ielts-junior", room: "C1" },
    { day: "sun", start: "09:00", end: "10:00", level: "starters", room: "A1" },
    { day: "sun", start: "10:15", end: "11:30", level: "movers", room: "A1" }
  ]
};
