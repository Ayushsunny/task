// store/taskStore.ts
import { create } from 'zustand';
import { Task, TaskStatus, Comment } from '../types/types';
import { ApiService } from '../services/api';

interface TaskState {
  tasks: Record<TaskStatus, Task[]>;
  currentTask: Task | null;
  comments: Comment[];
  loading: boolean;
  error: string | null;
  focusedTaskIndex: number;
  
  // Actions
  fetchTasks: (status: TaskStatus) => Promise<void>;
  fetchComments: (taskId: number) => Promise<void>;
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  createComment: (taskId: number, content: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  setFocusedTaskIndex: (index: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: {
    OPEN: [],
    IN_PROGRESS: [],
    CLOSED: []
  },
  currentTask: null,
  comments: [],
  loading: false,
  error: null,
  focusedTaskIndex: -1,

  fetchTasks: async (status: TaskStatus) => {
    set({ loading: true, error: null });
    try {
      const response = await ApiService.fetchTasks({
        task_status: status,
        page_details: { page_size: 20, offset: 0 }
      });
      
      set(state => ({
        tasks: {
          ...state.tasks,
          [status]: response.tasks
        }
      }));
    } catch (error) {
      set({ error: 'Failed to fetch tasks' });
    } finally {
      set({ loading: false });
    }
  },

  fetchComments: async (taskId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await ApiService.fetchComments({
        task_id: taskId,
        cursor: { last_comment_id: null, page_size: 10 }
      });
      set({ comments: response.comments });
    } catch (error) {
      set({ error: 'Failed to fetch comments' });
    } finally {
      set({ loading: false });
    }
  },

  updateTaskStatus: async (taskId: number, newStatus: TaskStatus) => {
    set({ loading: true, error: null });
    try {
      const updatedTask = await ApiService.updateTaskStatus(taskId, newStatus);
      
      set(state => {
        // Remove task from old status list
        const oldStatus = state.currentTask?.status as TaskStatus;
        const updatedTasks = { ...state.tasks };
        updatedTasks[oldStatus] = updatedTasks[oldStatus].filter(t => t.id !== taskId);
        
        // Add to new status list
        updatedTasks[newStatus] = [...updatedTasks[newStatus], updatedTask];
        
        return {
          tasks: updatedTasks,
          currentTask: updatedTask
        };
      });
    } catch (error) {
      set({ error: 'Failed to update task status' });
    } finally {
      set({ loading: false });
    }
  },

  createComment: async (taskId: number, content: string) => {
    set({ loading: true, error: null });
    try {
      const newComment = await ApiService.createComment(taskId, content);
      set(state => ({
        comments: [...state.comments, newComment]
      }));
    } catch (error) {
      set({ error: 'Failed to create comment' });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentTask: (task: Task | null) => {
    set({ currentTask: task });
  },

  setFocusedTaskIndex: (index: number) => {
    set({ focusedTaskIndex: index });
  }
}));