import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const fetchSchedule = async () => {
  const url = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network response was not ok");
  return await response.json();
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

const CourseList = ({ courses }) => (
  <div className="course-list">
    {Object.entries(courses).map(([id, course]) => (
      <Course key={id} course={course} />
    ))}
  </div>
);

const Course = ({ course }) => (
  <div className="card">
    <div className="card-body">
      <div className="card-title">
        {course.term} CS {course.number}
      </div>
      <div className="card-text">
        {course.title}
      </div>
    </div>
  </div>
);

export default App;