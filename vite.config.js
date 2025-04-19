import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd());
  
  console.log(`Running in ${mode} mode`);

  return {
    plugins: [react()],
    define: {
      // Make environment variables accessible in the client code
      // This is needed because Vite's default only exposes VITE_ prefixed variables
      // We're manually defining any other variables we want to expose
      'process.env': env
    },
    server: {
      port: 5173,
      proxy: {
        // Proxy API requests to the backend server during development
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
        }
      }
    }
  };
}); 