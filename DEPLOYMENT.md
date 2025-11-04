# 🚀 Deploying to Vercel

This guide provides step-by-step instructions for deploying the AI App Factory application to [Vercel](https://vercel.com).

## Step 1: Push to a GitHub Repository

First, make sure your project is on GitHub. If you cloned the original repository, you should create a new repository on your own GitHub account and push the code there.

1.  **Create a new repository** on [GitHub](https://github.com/new).
2.  **Link your local repository to the new GitHub repo and push:**
    ```bash
    # Make sure you are in the project directory
    git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    git branch -M main
    git push -u origin main
    ```

## Step 2: Import Project on Vercel

1.  **Sign up or Log in** to your [Vercel account](https://vercel.com/login). It's recommended to sign up using your GitHub account for seamless integration.

2.  **Import your project:**
    -   From your Vercel dashboard, click **"Add New..."** and select **"Project"**.
    -   In the "Import Git Repository" section, find the GitHub repository you just pushed to and click **"Import"**.

## Step 3: Configure Your Project

Vercel will automatically detect that you are deploying a Vite application and will pre-fill most of the settings. The most important step is to add your environment variables.

1.  **Framework Preset:** Vercel should automatically select **"Vite"**. If not, you can select it manually.

2.  **Build and Output Settings:** These should be detected automatically. No changes are needed.

3.  **Environment Variables:** This is a crucial step for the application to work.
    -   Expand the **"Environment Variables"** section.
    -   Add the following two variables:

        | Name           | Value                               |
        | -------------- | ----------------------------------- |
        | `API_KEY`      | Your Google AI API Key                |
        | `GITHUB_TOKEN` | Your GitHub Personal Access Token |

    -   **Important:** Ensure the names match exactly. Vercel encrypts these variables, keeping them secure.

4.  **Deploy:** Click the **"Deploy"** button.

Vercel will now start building and deploying your application. You can watch the progress in the build logs.

## Step 4: Enjoy!

Once the deployment is complete, Vercel will provide you with a URL (e.g., `your-project-name.vercel.app`). You can now visit this URL to use your live AI App Factory!