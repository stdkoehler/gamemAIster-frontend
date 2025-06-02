import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'


export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  // Determine if SSL should be enabled
  const USE_SSL = env.VITE_SSL_ENABLED === 'true';

  return {
    plugins: [react()],
    server: {
      ...(USE_SSL && {
        https: {
          key: fs.readFileSync('cert/key.pem'),
          cert: fs.readFileSync('cert/cert.pem'),
        }
      }),
      host: true,
    },
  };
});