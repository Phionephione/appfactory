import React from 'react';
import { GithubIcon } from './icons/GithubIcon';
import { PartyPopperIcon } from './icons/PartyPopperIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface SuccessScreenProps {
  repoName: string;
  githubUsername: string;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ repoName, githubUsername, onReset }) => {
  const repoUrl = `https://github.com/${githubUsername}/${repoName}`;

  return (
    <div className="text-center animate-fade-in-scale p-4">
      <div className="flex justify-center mb-4">
        <PartyPopperIcon className="w-16 h-16 text-yellow-400" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Success!</h2>
      <p className="text-gray-300 mb-6 text-lg">Your application code has been generated and pushed to a new GitHub repository.</p>
      
      <div className="space-y-4">
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600/50"
        >
          <GithubIcon className="w-6 h-6" />
          View Repository on GitHub
        </a>
        <button
          onClick={onReset}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          <ArrowPathIcon className="w-6 h-6" />
          Build Another App
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;