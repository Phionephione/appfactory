import { GoogleGenAI, Type } from "@google/genai";

// Fix: Per @google/genai guidelines, API_KEY must be obtained from process.env.API_KEY. This also resolves the TypeScript error for import.meta.env.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // Fix: Updated variable name in error message.
    throw new Error("API_KEY environment variable not set. Please add it via Secrets or in your .env file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateAppCode = async (idea: string, repoName: string): Promise<{ [filename: string]: string }> => {
  const prompt = `
    You are an expert web developer specializing in creating single-page applications with React and TypeScript using Vite.
    Your task is to generate a complete, self-contained, and working React application based on a user's idea.
    The application must be simple and directly implement the core idea.

    **User's App Idea:** "${idea}"
    **Repository Name:** "${repoName}"

    **Technical Requirements:**
    1.  **Framework:** React with TypeScript.
    2.  **Styling:** Use Tailwind CSS. The final app should be visually clean and modern.
    3.  **Structure:** Generate a JSON object where keys are filenames and values are the string content of those files. The paths should be relative to the project root (e.g., "src/App.tsx").
    4.  **File List:** You must generate the following files:
        -   \`index.html\`: Must be the standard Vite entry point, linking to \`/src/index.tsx\`. It should also link to \`src/index.css\`.
        -   \`src/index.tsx\`: The entry point that renders the \`App\` component and imports \`src/index.css\`.
        -   \`src/App.tsx\`: The main application component. This is where the primary logic and UI for the user's idea should be implemented.
        -   \`src/index.css\`: The main CSS file with Tailwind directives.
        -   \`README.md\`: A simple README file describing the project, based on the user's idea.
    5.  **Build System:** The project should be configured for a standard Vite build. All source code must be in the \`src\` directory.
    6.  **Code Quality:** The code should be well-formatted, commented where necessary, and follow best practices.

    Your response MUST be a valid JSON object matching the specified structure. Do not include any text or markdown outside of the JSON object.
    Example JSON structure:
    {
      "index.html": "<!DOCTYPE html>...",
      "src/index.tsx": "import React from 'react'...",
      "src/App.tsx": "import React, { useState } from 'react'...",
      "src/index.css": "@tailwind base;...",
      "README.md": "# My Awesome App..."
    }
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Using a more powerful model for code generation
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            "index.html": { type: Type.STRING },
            "src/index.tsx": { type: Type.STRING },
            "src/App.tsx": { type: Type.STRING },
            "src/index.css": { type: Type.STRING },
            "README.md": { type: Type.STRING },
          },
          required: ["index.html", "src/index.tsx", "src/App.tsx", "src/index.css", "README.md"],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString);
    
    if (parsed && typeof parsed === 'object') {
        return parsed;
    } else {
        throw new Error("Invalid response format from Gemini API.");
    }
  } catch (error)
  {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate application code from Gemini.");
  }
};