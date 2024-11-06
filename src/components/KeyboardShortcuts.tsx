// components/KeyboardShortcuts.tsx
"use client";

import { useState } from 'react';
import { Dialog } from '@headlessui/react';

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    {
      key: '↑/↓',
      description: 'Navigate through tasks in the table'
    },
    {
      key: 'Enter',
      description: 'Open selected task details'
    },
    {
      key: '←/→',
      description: 'Navigate between tasks in detail view'
    },
    {
      key: '1',
      description: 'Set task status to Open'
    },
    {
      key: '2',
      description: 'Set task status to In Progress'
    },
    {
      key: '3',
      description: 'Set task status to Closed'
    },
    {
      key: 'Esc',
      description: 'Close task detail view'
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700"
        title="Keyboard Shortcuts"
      >
        <kbd className="font-sans">⌨️</kbd>
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <div className="fixed inset-0 bg-black/30" />

          <div className="relative bg-white text-gray-900 rounded-lg w-full max-w-md mx-4 p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Keyboard Shortcuts
            </Dialog.Title>

            <div className="space-y-3">
              {shortcuts.map(({ key, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {key}
                  </kbd>
                  <span className="text-gray-600">{description}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Got it
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}