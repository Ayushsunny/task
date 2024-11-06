// types.ts
export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type SortingType = 'CREATION' | 'UPDATE';
export type SortingOrder = 'ASC' | 'DESC';

export interface Task {
  id: number;
  name: string;
  labels: string[];
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  priority: TaskPriority;
  assignee?: string;
  due_date?: string;
}

export interface PageDetails {
  page_size: number;
  offset?: number;
  sorting_type?: SortingType;
  sorting_order?: SortingOrder;
}

export interface TasksRequest {
  task_status: TaskStatus;
  page_details: PageDetails;
}

export interface TasksResponse {
  tasks: Task[];
  page_details: {
    page_size: number;
    has_next: boolean;
  };
}

export interface Comment {
  id: number;
  content: string;
  name_of_sender: string;
}

export interface CommentCursor {
  last_comment_id: number | null;
  page_size: number;
}

export interface CommentsRequest {
  task_id: number;
  cursor: CommentCursor;
}

export interface CommentsResponse {
  comments: Comment[];
  cursor: {
    last_message_id: number | null;
    page_size: number;
    has_next_message: boolean;
  };
}

// Mock data for testing
export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    name: "File upload for chats",
    labels: ["Update pending"],
    status: "OPEN",
    created_at: "2023-11-22T13:10:13.649Z",
    updated_at: "2023-11-22T13:10:13.649Z",
    priority: "Urgent",
    assignee: "John Doe",
    due_date: "2024-12-01"
  },
  {
    id: 2,
    name: "Implement user authentication",
    labels: ["Security", "Backend"],
    status: "IN_PROGRESS",
    created_at: "2023-11-23T09:15:00.000Z",
    updated_at: "2023-11-24T11:30:00.000Z",
    priority: "High",
    assignee: "Jane Smith",
    due_date: "2024-01-15"
  },
  {
    id: 3,
    name: "Design new landing page",
    labels: ["UI/UX", "Frontend"],
    status: "OPEN",
    created_at: "2023-11-24T14:20:00.000Z",
    updated_at: "2023-11-24T14:20:00.000Z",
    priority: "Medium",
    assignee: "Alice Johnson",
    due_date: "2024-02-28"
  },
  {
    id: 4,
    name: "Optimize database queries",
    labels: ["Performance", "Backend"],
    status: "IN_PROGRESS",
    created_at: "2023-11-25T10:05:00.000Z",
    updated_at: "2023-11-26T16:45:00.000Z",
    priority: "High",
    assignee: "Bob Williams",
    due_date: "2024-01-31"
  },
  {
    id: 5,
    name: "Write user documentation",
    labels: ["Documentation"],
    status: "OPEN",
    created_at: "2023-11-26T11:30:00.000Z",
    updated_at: "2023-11-26T11:30:00.000Z",
    priority: "Low",
    assignee: "Emma Brown",
    due_date: "2024-03-15"
  },
  {
    id: 6,
    name: "Fix cross-browser compatibility issues",
    labels: ["Bug", "Frontend"],
    status: "IN_PROGRESS",
    created_at: "2023-11-27T09:00:00.000Z",
    updated_at: "2023-11-28T14:20:00.000Z",
    priority: "Medium",
    assignee: "Michael Davis",
    due_date: "2024-01-20"
  },
  {
    id: 7,
    name: "Implement real-time notifications",
    labels: ["Feature", "Backend", "Frontend"],
    status: "OPEN",
    created_at: "2023-11-28T13:45:00.000Z",
    updated_at: "2023-11-28T13:45:00.000Z",
    priority: "High",
    assignee: "Sarah Wilson",
    due_date: "2024-02-10"
  },
  {
    id: 8,
    name: "Conduct security audit",
    labels: ["Security"],
    status: "CLOSED",
    created_at: "2023-11-29T10:30:00.000Z",
    updated_at: "2023-12-05T17:00:00.000Z",
    priority: "Urgent",
    assignee: "David Lee",
    due_date: "2023-12-05"
  },
  {
    id: 9,
    name: "Refactor legacy code",
    labels: ["Maintenance", "Backend"],
    status: "IN_PROGRESS",
    created_at: "2023-11-30T11:20:00.000Z",
    updated_at: "2023-12-01T09:15:00.000Z",
    priority: "Medium",
    assignee: "Olivia Martin",
    due_date: "2024-02-29"
  },
  {
    id: 10,
    name: "Create mobile app wireframes",
    labels: ["Design", "Mobile"],
    status: "OPEN",
    created_at: "2023-12-01T15:00:00.000Z",
    updated_at: "2023-12-01T15:00:00.000Z",
    priority: "Low",
    assignee: "Daniel Taylor",
    due_date: "2024-01-25"
  }
];

// Constants
export const ITEMS_PER_PAGE = 20;