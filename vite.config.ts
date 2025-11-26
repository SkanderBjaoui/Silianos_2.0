import { defineConfig } from 'vite';
import { angular } from '@angular-devkit/build-angular/plugins/vite';

export default defineConfig({
  plugins: [angular()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 10000,
    allowedHosts: ['silianos.onrender.com'],
  },
});

