import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, getOwnerTasks, postTask, putTask } from '../redux/slices/taskSlice'; 
import { useEffect, useState } from 'react';
import { getState } from '../redux/slices/authSlice';
import TaskBoard from '../components/TaskBoard';
import TaskForm from '../components/TaskForm';

const Home = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const { connectedUser: { _id } } = useSelector(getState);
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Charger les tâches au chargement de la page et quand nécessaire
  useEffect(() => {
    loadTasks();
  }, []);

  // Fonction pour charger les tâches
  const loadTasks = () => {
    dispatch(getOwnerTasks(_id));
  };
  
  const handleAddTask = (taskData) => {
    // Prépare les données de la tâche pour l'API
    const newTask = {
      ...taskData,
      owner: _id,
      completed: taskData.completed || false,
      // Mapper la nouvelle structure à celle attendue par l'API
      description: taskData.title,
      status: taskData.completed ? 'done' : 'todo' // status par défaut pour les nouvelles tâches
    };
    
    // Dispatch l'action postTask qui va créer la tâche dans le backend
    dispatch(postTask(newTask)).then(() => {
      // Recharger les tâches après la création
      loadTasks();
    });
  };

  const handleEditTask = (taskData) => {
    // Prépare les données pour la mise à jour
    const updatedTask = {
      ...editingTask,
      ...taskData,
      description: taskData.title, // Pour compatibilité avec l'API
      status: taskData.completed ? 'done' : (taskData.status || 'todo') // S'assurer du statut correct
    };
    
    // Dispatch l'action putTask qui va mettre à jour la tâche
    dispatch(putTask(updatedTask)).then(() => {
      // Recharger les tâches après la modification
      loadTasks();
    });
  };

  // Fonction pour rafraîchir les tâches (appelée par TaskBoard)
  const handleTaskUpdated = () => {
    loadTasks();
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#181A20]">
      <TaskBoard 
        onAddTask={() => setIsTaskFormOpen(true)}
        tasks={tasks}
        onEditTask={(task) => {
          setEditingTask(task);
          setIsTaskFormOpen(true);
        }}
        onTaskUpdated={handleTaskUpdated}
      />
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        initialData={editingTask}
      />
    </div>
  );
};

export default Home;
