// services/api.ts
import { 
  Task, 
  TaskStatus, 
  TasksRequest, 
  TasksResponse, 
  CommentsRequest, 
  CommentsResponse,
  MOCK_TASKS 
} from '../types/types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEY = 'task_distribution';

  
export class ApiService {
  private static getStoredTasks(): Record<TaskStatus, Task[]> {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // Initial distribution: all tasks start in OPEN
    const initialDistribution: Record<TaskStatus, Task[]> = {
      OPEN: MOCK_TASKS.map(task => ({ ...task, status: 'OPEN' })),
      IN_PROGRESS: [],
      CLOSED: []
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDistribution));
    return initialDistribution;
  }

  private static saveTaskDistribution(tasks: Record<TaskStatus, Task[]>) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
  
  static async fetchTasks(request: TasksRequest): Promise<TasksResponse> {
    await delay(500);
    
    const { task_status, page_details } = request;
    const { page_size, offset = 0 } = page_details;
    
    const allTasks = this.getStoredTasks();
    const tasksForStatus = allTasks[task_status] || [];
    
    return {
      tasks: tasksForStatus.slice(offset, offset + page_size),
      page_details: {
        page_size,
        has_next: tasksForStatus.length > offset + page_size
      }
    };
  }
  
    static async fetchComments(request: CommentsRequest): Promise<CommentsResponse> {
      await delay(300);
      
      // Mock comments for any task
      const comments = [
        {
          id: 1,
          content: "This needs to be prioritized",
          name_of_sender: "John Doe"
        },
        {
          id: 2,
          content: "Working on it now",
          name_of_sender: "Jane Smith"
        }
      ];
  
      return {
        comments,
        cursor: {
          last_message_id: comments[comments.length - 1]?.id || null,
          page_size: request.cursor.page_size,
          has_next_message: false
        }
      };
    }
  
    static async createComment(taskId: number, content: string): Promise<Comment> {
      await delay(300);
      
      return {
        id: Math.floor(Math.random() * 1000),
        content,
        name_of_sender: "Current User" // In a real app, this would come from auth
      };
    }
  
    static async updateTaskStatus(taskId: number, newStatus: TaskStatus): Promise<Task> {
      await delay(300);
      
      const allTasks = this.getStoredTasks();
      let taskToUpdate: Task | undefined;
      let oldStatus: TaskStatus | undefined;
  
      // Find the task and its current status
      for (const [status, tasks] of Object.entries(allTasks)) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          taskToUpdate = task;
          oldStatus = status as TaskStatus;
          break;
        }
      }
  
      if (!taskToUpdate || !oldStatus) {
        throw new Error('Task not found');
      }
  
      // Remove from old status array
      allTasks[oldStatus] = allTasks[oldStatus].filter(t => t.id !== taskId);
  
      // Update task and add to new status array
      const updatedTask = {
        ...taskToUpdate,
        status: newStatus,
        updated_at: new Date().toISOString()
      };
  
      allTasks[newStatus] = [...allTasks[newStatus], updatedTask];
  
      // Save updated distribution
      this.saveTaskDistribution(allTasks);
  
      return updatedTask;
    }
  }