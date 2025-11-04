import React from 'react';
import { BuildStep } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CogIcon } from './icons/CogIcon';


interface BuildingProgressProps {
  steps: BuildStep[];
}

const getStatusIcon = (status: BuildStep['status']) => {
  switch (status) {
    case 'complete':
      return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
    case 'in-progress':
      return <CogIcon className="w-6 h-6 text-blue-400 animate-spin" />;
    case 'pending':
    default:
      return <ClockIcon className="w-6 h-6 text-gray-500" />;
  }
};

const BuildingProgress: React.FC<BuildingProgressProps> = ({ steps }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-2">Building Your Vision...</h2>
      <p className="text-center text-gray-400 mb-8">Our AI agent is crafting your application. Please wait.</p>
      <ul className="space-y-4">
        {steps.map((step, index) => (
          <li key={step.id} className={`flex items-start gap-4 p-4 rounded-lg transition-all duration-500 ${
            step.status === 'in-progress' ? 'bg-blue-900/50 scale-105' : 'bg-gray-800'
          }`}>
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(step.status)}
            </div>
            <div className={`transition-opacity duration-500 ${step.status === 'pending' ? 'opacity-50' : 'opacity-100'}`}>
                <p className={`font-medium ${step.status === 'complete' ? 'text-green-300' : 'text-white'}`}>{step.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuildingProgress;