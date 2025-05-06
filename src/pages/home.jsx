import {Header, TodoComputed, TodoCreate, TodoFilter, TodoList, Profile_avatar } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, getFilter, getOwnerTasks } from '../redux/slices/taskSlice'; 
import { useEffect, useState } from 'react';
import { getState } from '../redux/slices/authSlice';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const dispatch = useDispatch()
  let tasks = useSelector(selectAllTasks)
  let {connectedUser: {_id}} = useSelector(getState)
  let filter = useSelector(getFilter)
  
  const itemsLeft = tasks.filter((task) => !task.completed).length;

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(getOwnerTasks(_id))
  }, []);
  
  const filteredTasks = () => {
    switch (filter) {
      case 'all':  return tasks;
      case 'active': return tasks.filter((task) => !task.completed);
      case 'completed': return tasks.filter((task) => task.completed);
      default:  return tasks;
    }
  };

  const handleAddTask = (taskData) => {
    // TODO: Implémenter l'ajout de tâche
    console.log('Nouvelle tâche:', taskData);
  };

  const handleEditTask = (taskData) => {
    // TODO: Implémenter la modification de tâche
    console.log('Tâche modifiée:', taskData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        <TaskBoard />
        <TaskForm
          isOpen={isTaskFormOpen}
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          initialData={editingTask}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
