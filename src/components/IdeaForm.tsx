import React, { useState } from 'react';
import { RocketLaunchIcon } from './icons/RocketLaunchIcon';

interface IdeaFormProps {
  onSubmit: (idea: string, repoName: string, token: string) => void;
  tokenRequired: boolean;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, tokenRequired }) => {
  const [idea, setIdea] = useState('');
  const [repoName, setRepoName] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && repoName.trim() && (!tokenRequired || token.trim())) {
      setLoading(true);
      onSubmit(idea, repoName, token);
    }
  };
  
  const isFormValid = idea.trim() !== '' && repoName.trim() !== '' && (!tokenRequired || token.trim() !== '');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="app-idea" className="block text-sm font-medium text-gray-300 mb-2">
          Your Brilliant App Idea
        </label>
        <textarea
          id="app-idea"
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          placeholder="e.g., A social network for pet owners to share photos and arrange playdates."
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="repo-name" className="block text-sm font-medium text-gray-300 mb-2">
          New GitHub Repository Name
        </label>
        <input
          id="repo-name"
          type="text"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
          placeholder="my-awesome-pet-app"
          disabled={loading}
        />
      </div>

      {tokenRequired && (
        <div>
            <label htmlFor="github-token" className="block text-sm font-medium text-gray-300 mb-2">
                GitHub Personal Access Token
            </label>
            <input
                id="github-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                placeholder="ghp_..."
                disabled={loading}
            />
            <p className="mt-2 text-xs text-gray-500">
              Required if not set as an environment variable. In AI Studio, use the Secrets panel. For local development, add `GITHUB_TOKEN="your_token"` to your `.env` file.
            </p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormValid || loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Brewing Magic...
          </>
        ) : (
          <>
            <RocketLaunchIcon className="w-6 h-6" />
            Build My App
          </>
        )}
      </button>
    </form>
  );
};

export default IdeaForm;