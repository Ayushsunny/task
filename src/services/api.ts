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
  
  // Simulated delay for mock API calls
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  export class ApiService {
    private static generateMockTasks(status: TaskStatus, pageSize: number, offset: number): Task[] {
      return MOCK_TASKS
        .map(task => ({ ...task, status }))
        .slice(offset, offset + pageSize);
    }
  
    static async fetchTasks(request: TasksRequest): Promise<TasksResponse> {
      await delay(500); // Simulate network delay
      
      const { task_status, page_details } = request;
      const { page_size, offset = 0 } = page_details;
      
      const tasks = this.generateMockTasks(task_status, page_size, offset);
      
      return {
        tasks,
        page_details: {
          page_size,
          has_next: tasks.length === page_size
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
  
    static async updateTaskStatus(taskId: number, status: TaskStatus): Promise<Task> {
      await delay(300);
      
      const task = MOCK_TASKS.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');
      
      return {
        ...task,
        status,
        updated_at: new Date().toISOString()
      };
    }
  }