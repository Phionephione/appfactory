import React, { useState, useCallback } from 'react';
import { AppState, type BuildStep, type GitHubUser, type AppFile } from './types';
import { generateAppCode } from './services/geminiService';
import * as githubService from './services/githubService';
import IdeaForm from './components/IdeaForm';
import BuildingProgress from './components/BuildingProgress';
import SuccessScreen from './components/SuccessScreen';
import ErrorScreen from './components/ErrorScreen';
import { GithubIcon } from './components/icons/GithubIcon';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [repoName, setRepoName] = useState<string>('');
  const [idea, setIdea] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null);

  const updateStepStatus = (
    targetId: number,
    status: BuildStep['status'],
    newText?: string
  ) => {
    setBuildSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === targetId ? { ...step, status, text: newText || step.text } : step
      )
    );
  };

  const handleFormSubmit = async (submittedIdea: string, repo: string, tokenFromForm: string) => {
    const token = process.env.GITHUB_TOKEN || tokenFromForm;
    if (!token) {
      setErrorMessage('A GitHub token is required to proceed. Please provide one in the input field.');
      setAppState(AppState.ERROR);
      return;
    }

    setAppState(AppState.LOADING);
    setRepoName(repo);
    setIdea(submittedIdea);

    const initialSteps: BuildStep[] = [
      { id: 0, text: 'Authenticating with GitHub...', status: 'in-progress' },
      { id: 1, text: `Creating new repository...`, status: 'pending' },
      { id: 2, text: 'Generating application code with AI...', status: 'pending' },
      { id: 3, text: 'Committing application files to repository...', status: 'pending' },
      { id: 4, text: 'Finalizing...', status: 'pending' },
    ];
    setBuildSteps(initialSteps);

    try {
      // Step 0: Authenticate and get user
      const user = await githubService.getUser(token);
      setGithubUser(user);
      updateStepStatus(0, 'complete', `Authenticated as ${user.login}`);

      // Step 1: Create Repo
      updateStepStatus(1, 'in-progress', `Creating new repository '${user.login}/${repo}'...`);
      await githubService.createRepo(token, repo, submittedIdea);
      updateStepStatus(1, 'complete', `Created repository '${user.login}/${repo}'`);

      // Step 2: Generate Application Code
      updateStepStatus(2, 'in-progress');
      const files: AppFile = await generateAppCode(submittedIdea, repo);
      updateStepStatus(2, 'complete', 'AI application code generated');

      // Step 3: Commit files to repository
      updateStepStatus(3, 'in-progress');
      await githubService.commitMultipleFiles(token, user.login, repo, files, 'feat: Initial commit with generated application');
      updateStepStatus(3, 'complete', 'Pushed application files to repository');
      
      // Step 4: Finalize
      updateStepStatus(4, 'in-progress');
      setTimeout(() => {
        updateStepStatus(4, 'complete');
        setAppState(AppState.SUCCESS);
      }, 1000);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      console.error('Build process failed:', error);
      setErrorMessage(`Build failed: ${message}. Please check your token and repository name, then try again.`);
      setAppState(AppState.ERROR);
    }
  };

  const resetApp = useCallback(() => {
    setAppState(AppState.IDLE);
    setBuildSteps([]);
    setRepoName('');
    setIdea('');
    setErrorMessage('');
    setGithubUser(null);
  }, []);


  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <BuildingProgress steps={buildSteps} />;
      case AppState.SUCCESS:
        return <SuccessScreen repoName={repoName} githubUsername={githubUser?.login || 'example-user'} onReset={resetApp} />;
      case AppState.ERROR:
        return <ErrorScreen message={errorMessage} onReset={resetApp} />;
      case AppState.IDLE:
      default:
        const tokenRequired = !process.env.GITHUB_TOKEN;
        return <IdeaForm onSubmit={handleFormSubmit} tokenRequired={tokenRequired} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SparklesIcon className="w-10 h-10 text-blue-500" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              AI App Factory
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Turn your ideas into reality, instantly.</p>
        </header>
        <main className="bg-gray-800/50 rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-700 backdrop-blur-sm">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500">
          <a href="https://github.com/google/prompt-gallery" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
            <GithubIcon className="w-5 h-5" />
            View on GitHub
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;