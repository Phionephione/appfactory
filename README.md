# 🚀 AI App Factory

Turn your ideas into reality, instantly. The AI App Factory is a web application that takes your application idea, generates a complete, working codebase using the Gemini API, and commits it directly to a new repository on your GitHub account.

![AI App Factory Screenshot](https://storage.googleapis.com/prompt-gallery/github-readme-images/ai-app-factory-screenshot.png)

## ✨ Features

-   **Idea to Code:** Describe your app idea in plain English.
-   **AI-Powered Code Generation:** Uses the Gemini API to generate a complete React + TypeScript + Tailwind CSS application.
-   **Automated GitHub Integration:** Automatically creates a new public repository on your GitHub account.
-   **Multi-File Commits:** Commits the entire generated application structure (`index.html`, `src/`, `README.md`, etc.) to your new repo.
-   **Ready for Vercel:** The project is structured with Vite, making it easy to deploy to hosting services like Vercel.

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need:

-   A **Google AI API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
-   A **GitHub Personal Access Token** with `repo` scope. [Create one here](https://github.com/settings/tokens/new).
-   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-app-factory.git
    cd ai-app-factory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    -   Create a new file named `.env` in the root of the project.
    -   Add your secret keys to this file:
        ```
        API_KEY="your_google_ai_api_key"
        GITHUB_TOKEN="your_github_personal_access_token"
        ```

### Running the App

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/). For detailed instructions, please see the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

## 🛠️ How It Works

1.  **User Input:** You provide your app idea and a name for the new repository.
2.  **GitHub Authentication:** The app uses your GitHub Token to authenticate with the GitHub API.
3.  **Repository Creation:** A new public repository is created under your GitHub account.
4.  **Gemini API Call:** A detailed prompt, including your idea and technical requirements, is sent to the Gemini API.
5.  **Code Generation:** Gemini returns a JSON object containing the complete file structure and code for a working Vite + React application.
6.  **File Commit:** The app uses the GitHub Git Trees API to commit all the generated files to the new repository.
7.  **Success:** You are given a link to your new repository, which now contains a fully-formed application, ready to be cloned and run.