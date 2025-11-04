import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Replaced `process.cwd()` with `''`. `loadEnv` uses `path.resolve`,
  // and `path.resolve('')` returns the current working directory,
  // same as `process.cwd()`, but this avoids the TypeScript type error.
  const env = loadEnv(mode, '', '');
  return {
    plugins: [react()],
    define: {
      // Expose environment variables to the client
      'process.env.GITHUB_TOKEN': JSON.stringify(env.GITHUB_TOKEN),
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    }
  }
})