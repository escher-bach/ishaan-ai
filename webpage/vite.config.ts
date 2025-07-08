import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import themePlugin from '@replit/vite-plugin-shadcn-theme-json'
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal'
import tailwindcss from '@tailwindcss/vite'

// Only needed if using the Cartographer plugin on Replit
const useCartographer = async () => {
  if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
    const mod = await import('@replit/vite-plugin-cartographer')
    return [mod.cartographer()]
  }
  return []
}

export default async () =>
  defineConfig({
    // server: {
    //   proxy: process.env.NODE_ENV === 'development'
    //     ? {
    //         '/api': 'http://localhost:5000',
    //       }
    //     : undefined,
    // },
    plugins: [
      react(),
      tailwindcss(),
      runtimeErrorOverlay(),
      themePlugin(),
      ...(await useCartographer()),
    ],
    resolve: {
      alias: {
        '@': '/src',
        '@shared': '/shared',
        '@assets': '/attached_assets',
      },
    },
    build: {
      outDir: 'dist', 
      emptyOutDir: true,
    },
  })