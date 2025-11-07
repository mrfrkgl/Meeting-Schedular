
import React, { useState } from 'react';
import UserForm from './components/UserForm';
import AdminView from './components/AdminView';

type View = 'user' | 'admin';

const App: React.FC = () => {
  const [view, setView] = useState<View>('user');

  const renderView = () => {
    switch (view) {
      case 'user':
        return <UserForm />;
      case 'admin':
        return <AdminView />;
      default:
        return <UserForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <h1 className="text-xl font-bold ml-2 text-gray-900">Meeting Scheduler</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setView('user')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  view === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                User View
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  view === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Results
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Created by a world-class senior frontend React engineer.</p>
      </footer>
    </div>
  );
};

export default App;
