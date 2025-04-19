import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/slide_me2/',
  build: {
    outDir: 'build' // เปลี่ยนโฟลเดอร์ output เป็น 'build'
  }
});
