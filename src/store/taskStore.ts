// store/taskStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStatus, Comment } from '../types/types';
import { ApiService } from '../services/api';

interface TaskState {
  tasks: Record<TaskStatus, Task[]>;
  currentTask: Task | null;
  comments: Record<number, Comment[]>;
  loading: boolean;
  error: string | null;
  focusedTaskIndex: number;
  initialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  fetchTasks: (status: TaskStatus) => Promise<void>;
  fetchComments: (taskId: number) => Promise<void>;
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<void>;
  createComment: (taskId: number, content: string) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  setFocusedTaskIndex: (index: number) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: {
        OPEN: [],
        IN_PROGRESS: [],
        CLOSED: []
      },
      currentTask: null,
      comments: {},
      loading: false,
      error: null,
      focusedTaskIndex: -1,
      initialized: false,

      initialize: async () => {
        if (!get().initialized) {
          await get().fetchTasks('OPEN');
          await get().fetchTasks('IN_PROGRESS');
          await get().fetchTasks('CLOSED');
          set({ initialized: true });
        }
      },

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
          // Only fetch if we don't have comments for this task
          if (!get().comments[taskId]) {
            const response = await ApiService.fetchComments({
              task_id: taskId,
              cursor: { last_comment_id: null, page_size: 10 }
            });
            set(state => ({
              comments: {
                ...state.comments,
                [taskId]: response.comments
              }
            }));
          }
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
            // Find the task in any status list
            let oldStatus: TaskStatus = 'OPEN';
            for (const [status, taskList] of Object.entries(state.tasks)) {
              if (taskList.find(t => t.id === taskId)) {
                oldStatus = status as TaskStatus;
                break;
              }
            }

            // Remove from old status and add to new status
            const updatedTasks = { ...state.tasks };
            updatedTasks[oldStatus] = updatedTasks[oldStatus].filter(t => t.id !== taskId);
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
            comments: {
              ...state.comments,
              [taskId]: [...(state.comments[taskId] || []), newComment]
            }
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
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
        initialized: state.initialized
      })
    }
  )
);