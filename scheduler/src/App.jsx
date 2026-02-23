import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import CourseList from './components/CourseList.jsx';
import { addScheduleTimes } from './utilities/times';

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
      <h1>{schedule.title}</h1>
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

export default App;