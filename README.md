# Task Manager

Task Manager is a efficient task management application built with Next.js, designed to streamline workflow and boost productivity - assignment by SuperDM.

## 🚀 Features

- **Dynamic Task Management**: Create, update, and delete tasks with ease
- **Advanced Sorting**: Multi-column sorting for better task organization
- **Smart Filtering**: Filter tasks by priority, assignee, and due date
- **Instant Search**: Quickly find tasks with real-time search functionality
- **Keyboard Navigation**: Efficiently navigate through tasks using keyboard shortcuts
- **Infinite Scrolling**: Smooth loading of large task lists
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: Next.js 15.0.2, React 18
- **State Management**: Zustand 5.0.1
- **Styling**: Tailwind CSS 3.4.1
- **Date Handling**: date-fns 4.1.0
- **UI Components**: @headlessui/react 2.2.0
- **Type Checking**: TypeScript 5

## 🏗 Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── global.css
├── components/
│   ├── KeyBoardShortcuts.tsx
│   ├── TaskTable.tsx
│   └── TaskTable.tsx
├── services/
│   └── api.ts
├── store/
│   └── taskStore.ts
└── types/
    └── types.ts
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/ayushsunny/task.git
   ```

2. Navigate to the project directory:

   ```
   cd task
   ```

3. Install dependencies:

   ```
   npm install
   ```

### Running the Application

- For development:

  ```
  npm run dev
  ```

- For production:

  ```
  npm run build
  npm start
  ```

Visit `http://localhost:3000` in your browser to use the application.

## 🧪 Running Tests

```
npm run test
```

## 🙏 Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)