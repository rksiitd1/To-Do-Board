import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';

const LuxuriousTodoBoard = () => {
  const [boards, setBoards] = useState([
    { id: 1, title: 'To Do', tasks: [] },
    { id: 2, title: 'In Progress', tasks: [] },
    { id: 3, title: 'Done', tasks: [] },
  ]);

  const addTask = (boardId) => {
    const newTask = prompt('Enter new task:');
    if (newTask) {
      setBoards(boards.map(board => 
        board.id === boardId 
          ? { ...board, tasks: [...board.tasks, { id: Date.now(), content: newTask }] }
          : board
      ));
    }
  };

  const removeTask = (boardId, taskId) => {
    setBoards(boards.map(board => 
      board.id === boardId 
        ? { ...board, tasks: board.tasks.filter(task => task.id !== taskId) }
        : board
    ));
  };

  const moveTask = (fromBoardId, toBoardId, taskId) => {
    const task = boards.find(b => b.id === fromBoardId).tasks.find(t => t.id === taskId);
    setBoards(boards.map(board => {
      if (board.id === fromBoardId) {
        return { ...board, tasks: board.tasks.filter(t => t.id !== taskId) };
      }
      if (board.id === toBoardId) {
        return { ...board, tasks: [...board.tasks, task] };
      }
      return board;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-white">Luxurious To-Do Board</h1>
      <div className="flex justify-center space-x-8">
        {boards.map(board => (
          <motion.div
            key={board.id}
            className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg p-6 w-80"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">{board.title}</h2>
            {board.tasks.map(task => (
              <motion.div
                key={task.id}
                className="bg-white bg-opacity-20 rounded-lg p-4 mb-3 cursor-move"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  const distance = info.offset.x;
                  const threshold = 100;
                  if (Math.abs(distance) > threshold) {
                    const direction = distance > 0 ? 1 : -1;
                    const currentIndex = boards.findIndex(b => b.id === board.id);
                    const newIndex = Math.max(0, Math.min(boards.length - 1, currentIndex + direction));
                    moveTask(board.id, boards[newIndex].id, task.id);
                  }
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">{task.content}</span>
                  <button onClick={() => removeTask(board.id, task.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
            <motion.button
              onClick={() => addTask(board.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg mt-4 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PlusCircle size={20} className="mr-2" />
              Add Task
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LuxuriousTodoBoard;
