// components/TaskModal.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { TaskStatus } from '../types/types';
import { useTaskStore } from '../store/taskStore';
import { format } from 'date-fns';

export default function TaskModal() {
    const {
        currentTask,
        setCurrentTask,
        comments,
        fetchComments,
        createComment,
        updateTaskStatus,
        tasks,
        focusedTaskIndex,
        setFocusedTaskIndex
    } = useTaskStore();

    const [newComment, setNewComment] = useState('');
    const [isConfirmingStatus, setIsConfirmingStatus] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);

    useEffect(() => {
        if (currentTask) {
            fetchComments(currentTask.id);
        }
    }, [currentTask, fetchComments]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!currentTask) return;

        const currentStatus = currentTask.status as TaskStatus;
        const statusTasks = tasks[currentStatus];

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const currentIndex = focusedTaskIndex;
            const newIndex = e.key === 'ArrowLeft'
                ? (currentIndex > 0 ? currentIndex - 1 : statusTasks.length - 1)
                : (currentIndex < statusTasks.length - 1 ? currentIndex + 1 : 0);

            setFocusedTaskIndex(newIndex);
            setCurrentTask(statusTasks[newIndex]);
        } else if (['1', '2', '3'].includes(e.key)) {
            e.preventDefault();
            const statusMap: Record<string, TaskStatus> = {
                '1': 'OPEN',
                '2': 'IN_PROGRESS',
                '3': 'CLOSED'
            };
            const newStatus = statusMap[e.key];
            if (newStatus !== currentTask.status) {
                setPendingStatus(newStatus);
                setIsConfirmingStatus(true);
            }
        }
    }, [currentTask, focusedTaskIndex, setCurrentTask, setFocusedTaskIndex, tasks]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!currentTask) return null;

    const handleStatusChange = async (confirmed: boolean) => {
        if (confirmed && currentTask && pendingStatus) {
            await updateTaskStatus(currentTask.id, pendingStatus);
        }
        setIsConfirmingStatus(false);
        setPendingStatus(null);
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentTask && newComment.trim()) {
            await createComment(currentTask.id, newComment);
            setNewComment('');
        }
    };
    const taskComments = currentTask ? comments[currentTask.id] || [] : [];


    return (
        <>
            <Dialog
                open={true}
                onClose={() => setCurrentTask(null)}
                className="fixed inset-0 z-50 overflow-y-auto"
            >
                <div className="flex min-h-screen items-center justify-center">
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                    <div className="relative bg-white text-gray-800 rounded-lg w-full max-w-3xl mx-4 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    #{currentTask.id} {currentTask.name}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Created {format(new Date(currentTask.created_at), 'MMM dd, yyyy')}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <select
                                    value={currentTask.status}
                                    onChange={(e) => {
                                        setPendingStatus(e.target.value as TaskStatus);
                                        setIsConfirmingStatus(true);
                                    }}
                                    className="rounded-md border border-gray-300 px-3 py-1.5"
                                >
                                    <option value="OPEN">Open (1)</option>
                                    <option value="IN_PROGRESS">In Progress (2)</option>
                                    <option value="CLOSED">Closed (3)</option>
                                </select>

                                <button
                                    onClick={() => setCurrentTask(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Close</span>
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="font-medium">Priority: </span>
                                <span className={`
                  inline-block px-2 py-1 rounded-full text-xs font-medium
                  ${currentTask.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                                        currentTask.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                            currentTask.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'}
                `}>
                                    {currentTask.priority}
                                </span>
                            </div>
                            {currentTask.due_date && (
                                <div>
                                    <span className="font-medium">Due Date: </span>
                                    {format(new Date(currentTask.due_date), 'MMM dd, yyyy')}
                                </div>
                            )}
                            {currentTask.assignee && (
                                <div>
                                    <span className="font-medium">Assignee: </span>
                                    {currentTask.assignee}
                                </div>
                            )}
                            <div>
                                <span className="font-medium">Labels: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {currentTask.labels.map((label, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-medium mb-4">Comments</h3>
                            <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                                {taskComments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                        <div className="font-medium text-sm">{comment.name_of_sender}</div>
                                        <div className="text-gray-600 mt-1">{comment.content}</div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleCommentSubmit} className="mt-4">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add Comment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </Dialog>

            {isConfirmingStatus && (
                <Dialog
                    open={true}
                    onClose={() => setIsConfirmingStatus(false)}
                    className="fixed inset-0 z-50 overflow-y-auto"
                >
                    <div className="flex min-h-screen items-center justify-center">
                        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                        <div className="relative bg-white text-gray-800 rounded-lg w-full max-w-md mx-4 p-6">
                            <h3 className="text-lg font-medium mb-4">Confirm Status Change</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to change the status from {currentTask.status} to {pendingStatus}?
                            </p>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => handleStatusChange(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleStatusChange(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
}