import { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const TaskBoard = () => {
  const [columns, setColumns] = useState({
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
  });

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceTasks = [...sourceColumn.tasks];
    const destTasks = [...destColumn.tasks];
    const [removed] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        }
      });
    } else {
      destTasks.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceTasks
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destTasks
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mon Tableau de Tâches</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200">
            <i className="fas fa-plus mr-2"></i>
            Nouvelle tâche
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(columns).map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      {column.title}
                    </h2>
                    <div className="space-y-3">
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                              whileHover={{ scale: 1.02 }}
                            >
                              <h3 className="font-medium text-gray-800">{task.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              <div className="flex items-center mt-3 space-x-2">
                                <span className="text-xs text-gray-500">
                                  <i className="far fa-calendar mr-1"></i>
                                  {task.dueDate}
                                </span>
                                {task.labels?.map((label) => (
                                  <span
                                    key={label}
                                    className="text-xs px-2 py-1 rounded-full"
                                    style={{ backgroundColor: label.color }}
                                  >
                                    {label.text}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
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