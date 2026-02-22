export const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

export const days = ['M', 'Tu', 'W', 'Th', 'F'];

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

export const timeParts = meets => {
  const [match, days, hh1, mm1, hh2, mm2] =
    meetsPat.exec(meets) || [];

  return !match ? {} : {
    days,
    hours: {
      start: hh1 * 60 + mm1 * 1,
      end: hh2 * 60 + mm2 * 1
    }
  };
};

const mapValues = (fn, obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, fn(v)])
  );

const addCourseTimes = course => ({
  ...course,
  ...timeParts(course.meets)
});

export const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});

export const daysOverlap = (days1, days2) =>
  days.some(day =>
    days1.includes(day) && days2.includes(day)
  );

export const hoursOverlap = (h1, h2) =>
  Math.max(h1.start, h2.start) <
  Math.min(h1.end, h2.end);

export const timeConflict = (c1, c2) =>
  daysOverlap(c1.days, c2.days) &&
  hoursOverlap(c1.hours, c2.hours);

export const courseConflict = (c1, c2) =>
  c1.term === c2.term &&
  timeConflict(c1, c2);

export const hasConflict = (course, selected) =>
  selected.some(sel =>
    courseConflict(course, sel)
  );