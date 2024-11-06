// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { TaskStatus } from '../types/types';
import TaskTable from '../components/Tasktable';
import TaskModal from '../components/TaskModal';
import { useTaskStore } from '../store/taskStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TaskStatus>('OPEN');
  const { initialize, loading, tasks } = useTaskStore();

  useEffect(() => {
    // Initialize all task lists once when the app starts
    initialize();
  }, [initialize]);

  const tabs: { label: string; value: TaskStatus }[] = [
    { label: `Open (${tasks['OPEN'].length})`, value: 'OPEN' },
    { label: `In Progress (${tasks['IN_PROGRESS'].length})`, value: 'IN_PROGRESS' },
    { label: `Closed (${tasks['CLOSED'].length})`, value: 'CLOSED' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map(({ label, value }) => (
                <button
                  key={value}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === value
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  onClick={() => setActiveTab(value)}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : (
              <TaskTable status={activeTab} />
            )}
          </div>

          <TaskModal />
        </div>
      </div>
    </div>
  );
}