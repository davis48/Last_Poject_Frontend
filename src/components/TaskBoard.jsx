import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, CalendarIcon, TagIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { useDispatch } from 'react-redux';
import { deleteTask, putTask, getOwnerTasks } from '../redux/slices/taskSlice';

const initialColumns = {
  'todo': {
    id: 'todo',
    title: 'À faire',
    tasks: []
  },
  'in-progress': {
    id: 'in-progress',
    title: 'En cours',
    tasks: []
  },
  'done': {
    id: 'done',
    title: 'Terminé',
    tasks: []
  }
};

const Notification = ({ message, type, onClose }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -40, opacity: 0 }}
        className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
      >
        <div className="flex items-center space-x-3">
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">&times;</button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const TaskBoard = ({ onAddTask, tasks = [], onEditTask, onTaskUpdated }) => {
  const dispatch = useDispatch();
  const [columns, setColumns] = useState(initialColumns);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  // Organisez les tâches dans les colonnes appropriées
  useEffect(() => {
    if (tasks && tasks.length > 0) {
      // Initialiser les colonnes vides
      const newColumns = {
        'todo': { ...initialColumns.todo, tasks: [] },
        'in-progress': { ...initialColumns['in-progress'], tasks: [] },
        'done': { ...initialColumns.done, tasks: [] }
      };

      // Remplir les colonnes avec les tâches, en évitant les doublons
      const processedTaskIds = new Set();
      
      tasks.forEach(task => {
        // Éviter de traiter deux fois la même tâche
        if (processedTaskIds.has(task._id)) return;
        processedTaskIds.add(task._id);
        
        // Mappage basé sur le statut et l'état de complétion
        let columnId = 'todo';
        
        if (task.status === 'in-progress' || task.status === 'in_progress') {
          columnId = 'in-progress';
        } else if (task.status === 'done' || task.completed) {
          columnId = 'done';
        }

        // Adapter le format de tâche pour l'affichage
        const formattedTask = {
          id: task._id,
          _id: task._id,
          title: task.description || task.title || '',
          description: task.description || '',
          dueDate: task.dueDate || '',
          dueTime: task.dueTime || '',
          status: task.status || (task.completed ? 'done' : 'todo'),
          completed: task.completed || task.status === 'done',
          labels: task.labels || [],
          owner: task.owner,
          // Autres propriétés importantes
          ...task
        };

        newColumns[columnId].tasks.push(formattedTask);
      });

      setColumns(newColumns);
    } else {
      // Si pas de tâches, réinitialiser les colonnes
      setColumns({
        'todo': { ...initialColumns.todo, tasks: [] },
        'in-progress': { ...initialColumns['in-progress'], tasks: [] },
        'done': { ...initialColumns.done, tasks: [] }
      });
    }
  }, [tasks]);

  // Statistiques
  const totalTasks = Object.values(columns).reduce((acc, col) => acc + col.tasks.length, 0);
  const stats = {
    todo: columns['todo'].tasks.length,
    inProgress: columns['in-progress'].tasks.length,
    done: columns['done'].tasks.length,
    total: totalTasks
  };

  // Gestion Drag & Drop
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);

    // Mise à jour du statut de la tâche lors du déplacement
    const updatedTask = {
      ...removed,
      status: destination.droppableId,
      // Si déplacé dans "done", marquer comme complété
      completed: destination.droppableId === 'done'
    };

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, updatedTask);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, tasks: sourceTasks }
      });
    } else {
      destTasks.splice(destination.index, 0, updatedTask);
      setColumns({
        ...columns,
        [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
        [destination.droppableId]: { ...destColumn, tasks: destTasks }
      });
    }

    // Mettre à jour l'état de la tâche dans le backend
    dispatch(putTask(updatedTask))
      .then(() => {
        // Rafraîchir les tâches via le parent
        if (typeof onTaskUpdated === 'function') {
          onTaskUpdated();
        }
        setNotification({ message: 'Tâche déplacée avec succès', type: 'success' });
      })
      .catch(() => {
        setNotification({ message: 'Erreur lors du déplacement', type: 'error' });
      });
  };

  // Supprimer une tâche
  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId))
      .then(() => {
        // Rafraîchir les tâches via le parent
        if (typeof onTaskUpdated === 'function') {
          onTaskUpdated();
        }
        setNotification({ message: 'Tâche supprimée', type: 'success' });
      })
      .catch(() => {
        setNotification({ message: 'Erreur lors de la suppression', type: 'error' });
      });
  };

  // Marquer une tâche comme terminée
  const handleMarkAsCompleted = (task) => {
    // S'assurer que l'on utilise le bon identifiant (le backend utilise _id)
    const updatedTask = {
      ...task,
      _id: task._id || task.id, // S'assurer que _id est défini pour le backend
      completed: !task.completed,
      status: !task.completed ? 'done' : 'todo'
    };

    // Plutôt que de manipuler directement l'état des colonnes, on va laisser
    // le useEffect s'occuper de la réorganisation après la mise à jour dans le backend

    // Mettre à jour dans le backend
    dispatch(putTask(updatedTask))
      .then(() => {
        // Rafraîchir les tâches via le parent
        if (typeof onTaskUpdated === 'function') {
          onTaskUpdated();
          setNotification({ 
            message: updatedTask.completed ? 'Tâche marquée comme terminée' : 'Tâche marquée comme non terminée', 
            type: 'success' 
          });
        } else {
          // Fallback si onTaskUpdated n'est pas disponible
          dispatch(getOwnerTasks(updatedTask.owner));
          setNotification({ 
            message: updatedTask.completed ? 'Tâche marquée comme terminée' : 'Tâche marquée comme non terminée', 
            type: 'success' 
          });
        }
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        setNotification({ message: 'Erreur lors de la mise à jour', type: 'error' });
      });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#181A20]">
      {/* Notifications */}
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: 'success' })} />

      {/* Statistiques */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-0 md:px-8 py-4 border-b border-gray-800 bg-[#23262F]">
        <div className="pl-6 md:pl-0">
          <h1 className="text-2xl font-bold text-white">Mon Tableau de Tâches</h1>
          <p className="text-sm text-gray-400 mt-1">Gérez vos tâches efficacement</p>
        </div>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <div className="text-center">
            <span className="text-lg font-bold text-indigo-400">{stats.total}</span>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-yellow-400">{stats.todo}</span>
            <div className="text-xs text-gray-400">À faire</div>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-blue-400">{stats.inProgress}</span>
            <div className="text-xs text-gray-400">En cours</div>
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-green-400">{stats.done}</span>
            <div className="text-xs text-gray-400">Terminées</div>
          </div>
        </div>
        <button
          onClick={onAddTask}
          className="ml-0 md:ml-8 mt-4 md:mt-0 flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Nouvelle tâche
        </button>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-auto w-full p-0 md:p-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full w-full">
            {Object.values(columns).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col bg-[#23262F] rounded-xl shadow-lg border border-gray-800 h-full min-h-[400px] w-full"
                  >
                    {/* En-tête de colonne */}
                    <div className="px-4 py-3 border-b border-gray-800">
                      <h2 className="text-lg font-semibold text-white">
                        {column.title}
                      </h2>
                    </div>

                    {/* Liste des tâches */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <AnimatePresence>
                        {column.tasks.length === 0 && (
                          <div className="text-center text-gray-500 text-sm mt-8">Aucune tâche</div>
                        )}
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <motion.div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-[#181A20] p-4 rounded-lg border ${
                                  snapshot.isDragging
                                    ? 'border-indigo-500 shadow-xl'
                                    : 'border-gray-700 shadow'
                                } flex flex-col space-y-2`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <button 
                                      onClick={() => handleMarkAsCompleted(task)} 
                                      className="mr-2 focus:outline-none"
                                      title={task.completed ? "Marquer comme non terminée" : "Marquer comme terminée"}
                                    >
                                      {task.completed ? (
                                        <CheckCircleSolidIcon className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-green-400" />
                                      )}
                                    </button>
                                    <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                      {task.title}
                                    </h3>
                                  </div>
                                  <div className="flex space-x-2">
                                    <button onClick={() => onEditTask(task)} className="p-1 rounded hover:bg-gray-800 text-indigo-400">
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="p-1 rounded hover:bg-gray-800 text-red-400">
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{task.description}</p>
                                <div className="mt-2 flex items-center space-x-4">
                                  {task.dueDate && (
                                    <div className="flex items-center text-xs text-gray-400">
                                      <CalendarIcon className="h-4 w-4 mr-1" />
                                      {task.dueDate}
                                      {task.dueTime && ` à ${task.dueTime}`}
                                    </div>
                                  )}
                                  {task.labels?.length > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <TagIcon className="h-4 w-4 text-gray-500" />
                                      {task.labels.map((label) => (
                                        <span
                                          key={label}
                                          className="text-xs px-2 py-1 rounded-full"
                                          style={{ backgroundColor: label.color }}
                                        >
                                          {label.text}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskBoard; 