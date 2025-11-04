import React from 'react';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface ErrorScreenProps {
  message: string;
  onReset: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onReset }) => {
  return (
    <div className="text-center animate-fade-in-scale p-4">
      <div className="flex justify-center mb-4">
        <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />
      </div>
      <h2 className="text-3xl font-bold mb-2 text-red-400">An Error Occurred</h2>
      <p className="text-gray-300 mb-6 text-lg">{message || 'Something went wrong. Please try again.'}</p>
      
      <button
        onClick={onReset}
        className="w-full inline-flex items-center justify-center gap-2 bg-brand-secondary hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      >
        <ArrowPathIcon className="w-6 h-6" />
        Try Again
      </button>
    </div>
  );
};

export default ErrorScreen;
