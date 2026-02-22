import React, { useState } from 'react';
import Course from './Course.jsx';
import { terms } from '../utilities/times';

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

export default CourseList;