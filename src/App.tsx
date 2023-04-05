import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  ListItem,
  Text,
  UnorderedList
} from "@chakra-ui/react";
import {FormEventHandler, useEffect, useMemo, useState} from "react";
import {SingleDatepicker} from "chakra-dayzed-datepicker";
import dayjs from "dayjs";

const App = () => {
  const [newTask, setNewTask] = useState("");
  const [dateSelected, setDateSelected] = useState(new Date());
  const [tasks, setTasks] = useState<Record<string, string[]> | null>(null);

  const currentDate = useMemo(() => dayjs(dateSelected).format('DD-MM-YYYY'), [dateSelected]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');

    if (!savedTasks) return;

    setTasks(JSON.parse(savedTasks));
  }, []);

  useEffect(() => {
    if (!tasks) {
      localStorage.removeItem('tasks');
      return;
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    e.currentTarget.reset();

    setTasks(prevTasks => ({
      ...prevTasks,
      [currentDate]: [...(prevTasks && prevTasks[currentDate] ? prevTasks[currentDate] : []), newTask]
    }));
  }

  return (
    <Container>
      <Heading my={6} as="h1">What I did today?</Heading>

      <FormControl mb={4}>
        <FormLabel>Select the date</FormLabel>
        <SingleDatepicker configs={{dateFormat: "dd/MM/yyyy"}} onDateChange={setDateSelected} date={dateSelected} name="date"/>
      </FormControl>

      <Box as="form" onSubmit={submitHandler}>
        <FormControl>
          <FormLabel>Write a task that you have completed today</FormLabel>
          <Input name="task"

                 onChange={e => setNewTask(e.target.value)}
                 placeholder="What I did today?"/>
          <FormHelperText>Press <code>Enter</code> to add the task</FormHelperText>
        </FormControl>
      </Box>

      {tasks && tasks[currentDate]?.length > 0 && (
        <>
          <Button my={4}
                  onClick={() => setTasks(null)}
                  colorScheme="red">Clear all the
            tasks</Button>

          <Text>In the following list are listed the task that have been done today:</Text>

          <UnorderedList my={4}>
            {tasks[currentDate].map((task, index) => <ListItem key={index}>{task}</ListItem>)}
          </UnorderedList>
        </>
      )}
    </Container>
  )
}

export default App
