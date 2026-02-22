import React, { useState } from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const fetchSchedule = async () => {
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok");
  return addScheduleTimes(await response.json());
};

const Main = () => {
  const { data: schedule, isLoading, error } = useQuery({
    queryKey: ['schedule'],
    queryFn: fetchSchedule
  });

  if (error) return <h1>{error.toString()}</h1>;
  if (isLoading) return <h1>Loading the schedule...</h1>;

  return (
    <div className="container">
      <Banner title={schedule.title} />
      <CourseList courses={schedule.courses} />
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);

const Banner = ({ title }) => (
  <h1>{title}</h1>
);

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
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

const addScheduleTimes = schedule => ({
  title: schedule.title,
  courses: mapValues(addCourseTimes, schedule.courses)
});

const days = ['M', 'Tu', 'W', 'Th', 'F'];

const daysOverlap = (days1, days2) =>
  days.some(day =>
    days1.includes(day) && days2.includes(day)
  );

const hoursOverlap = (h1, h2) =>
  Math.max(h1.start, h2.start) <
  Math.min(h1.end, h2.end);

const timeConflict = (c1, c2) =>
  daysOverlap(c1.days, c2.days) &&
  hoursOverlap(c1.hours, c2.hours);

const courseConflict = (c1, c2) =>
  c1.term === c2.term &&
  timeConflict(c1, c2);

const hasConflict = (course, selected) =>
  selected.some(sel =>
    courseConflict(course, sel)
  );

const terms = { F: 'Fall', W: 'Winter', S: 'Spring' };

const CourseList = ({ courses }) => {
  const [term, setTerm] = useState('Fall');
  const [selected, setSelected] = useState([]);

  const termCourses = Object.values(courses)
    .filter(course => term === course.term);

  return (
    <>
      <TermSelector term={term} setTerm={setTerm} />
      <div className="course-list">
        {termCourses.map(course =>
          <Course
            key={course.id}
            course={course}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
    </>
  );
};

const toggle = (x, lst) =>
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst];

const TermSelector = ({ term, setTerm }) => (
  <div className="btn-group">
    {Object.values(terms).map(value => (
      <TermButton
        key={value}
        term={value}
        checked={value === term}
        setTerm={setTerm}
      />
    ))}
  </div>
);

const TermButton = ({ term, checked, setTerm }) => (
  <>
    <input
      type="radio"
      id={term}
      className="btn-check"
      autoComplete="off"
      checked={checked}
      onChange={() => setTerm(term)}
    />
    <label className="btn btn-success m-1 p-2" htmlFor={term}>
      {term}
    </label>
  </>
);

const Course = ({ course, selected, setSelected }) => {
  const isSelected = selected.includes(course);
  const isDisabled =
    !isSelected && hasConflict(course, selected);

  const style = {
    backgroundColor: isDisabled
      ? 'lightgrey'
      : isSelected
      ? 'lightgreen'
      : 'white'
  };

  return (
    <div
      className="card m-1 p-2"
      style={style}
      onClick={
        isDisabled
          ? null
          : () => setSelected(toggle(course, selected))
      }
    >
      <div className="card-body">
        <div className="card-title">
          {course.term} CS {course.number}
        </div>
        <div className="card-text">{course.title}</div>
        <div className="card-text">{course.meets}</div>
      </div>
    </div>
  );
};

export default App;