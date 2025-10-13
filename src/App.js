import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Tailwind CSS Test
          </div>
          <h1 className="block mt-1 text-lg leading-tight font-medium text-black">
            Hello Tailwind!
          </h1>
          <p className="mt-2 text-gray-500">
            If you can see this styled card, Tailwind CSS is working correctly in your React app.
          </p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
