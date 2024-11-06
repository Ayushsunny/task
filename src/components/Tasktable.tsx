// components/TaskTable.tsx
"use client";

import { useEffect, useCallback, useState } from 'react';
import { Task, TaskStatus, SortingOrder } from '../types/types';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';

interface TaskTableProps {
  status: TaskStatus;
}

export default function TaskTable({ status }: TaskTableProps) {
  const { 
    tasks, 
    setCurrentTask, 
    focusedTaskIndex, 
    setFocusedTaskIndex,
    updateTaskStatus 
  } = useTaskStore();
  
  const [sortOrder, setSortOrder] = useState<SortingOrder>('DESC');
  const [searchTerm, setSearchTerm] = useState('');
  const currentTasks = tasks[status];

  const filteredTasks = currentTasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.labels.some(label => label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedTaskIndex(prev => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedTaskIndex(prev => Math.min(sortedTasks.length - 1, prev + 1));
    } else if (e.key === 'Enter' && focusedTaskIndex >= 0) {
      setCurrentTask(sortedTasks[focusedTaskIndex]);
    }
  }, [sortedTasks, focusedTaskIndex, setCurrentTask, setFocusedTaskIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: TaskStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
          className="ml-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Sort by Date {sortOrder === 'ASC' ? '↑' : '↓'}
        </button>
      </div>

      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Labels
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task, index) => (
              <tr
                key={task.id}
                className={`
                  cursor-pointer hover:bg-gray-50 transition-colors
                  ${index === focusedTaskIndex ? 'bg-blue-50' : ''}
                `}
                onClick={() => {
                  setFocusedTaskIndex(index);
                  setCurrentTask(task);
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{task.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    {task.labels.map((label, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}