// components/TaskTable.tsx
"use client";

import { useEffect, useCallback, useState } from 'react';
import { TaskStatus, SortingOrder } from '../types/types';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';
import { ApiService } from '../services/api';

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

    const currentTasks = tasks[status] || [];

    const [filters, setFilters] = useState({
        priority: '',
        assignee: '',
        dueDate: ''
    });

    const filteredTasks = currentTasks
        .filter(task =>
            (!filters.priority || task.priority === filters.priority) &&
            (!filters.assignee || task.assignee === filters.assignee) &&
            (!filters.dueDate || task.due_date === filters.dueDate)
        )
        .filter(task =>
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
            setFocusedTaskIndex(Math.max(0, focusedTaskIndex - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setFocusedTaskIndex(Math.min(sortedTasks.length - 1, focusedTaskIndex + 1));
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

    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const loadMore = useCallback(async () => {
        if (!hasMore) return;
        const response = await ApiService.fetchTasks({
            task_status: status,
            page_details: {
                page_size: 20,
                offset: page * 20
            }
        });

        setHasMore(response.page_details.has_next);
        setPage(prev => prev + 1);
    }, [hasMore, page, status]);

    // Add intersection observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { threshold: 0.5 }
        );

        const sentinel = document.querySelector('#sentinel');
        if (sentinel) observer.observe(sentinel);

        return () => observer.disconnect();
    }, [loadMore, hasMore]);

    return (
        <div className="space-y-4">
            {currentTasks.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        {status === 'OPEN' && 'No open tasks available'}
                        {status === 'IN_PROGRESS' && 'No tasks in progress'}
                        {status === 'CLOSED' && 'No closed tasks'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <div className="flex-1 max-w-xs">
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                className="w-full px-4 py-2 border text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex ">
                        <button
                            onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
                            className="ml-4 px-4 py-2= border text-gray-800 rounded-lg hover:bg-gray-50"
                        >
                            Sort by Date {sortOrder === 'ASC' ? '↑' : '↓'}
                        </button>
                        <div className="flex gap-4">
                            <select
                                value={filters.priority}
                                onChange={e => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                className="ml-4 px-2 py-2.5 border text-gray-800 rounded-lg hover:bg-gray-50"
                            >
                                <option value="">All Priorities</option>
                                <option value="Urgent">Urgent</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                            {/* Add similar filters for assignee and due date */}
                        </div>
                        </div>
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
                                        key={`${task.id}-${index}`}
                                        className={`
                  cursor-pointer hover:bg-gray-50 transition-colors
                  ${index === focusedTaskIndex ? 'bg-blue-50' : ''}
                `}
                                        onClick={() => {
                                            setFocusedTaskIndex(index);
                                            setCurrentTask(task);
                                        }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            #{task.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
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
                </>
            )}
        </div>

    );
}