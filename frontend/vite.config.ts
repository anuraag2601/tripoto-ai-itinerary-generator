import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isWidget = mode === 'widget'
  
  return {
    plugins: [react()],
    
    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@shared': resolve(__dirname, '../shared'),
      },
    },
    
    // Build configuration
    build: {
      outDir: isWidget ? 'dist-widget' : 'dist',
      
      ...(isWidget && {
        // Widget-specific build configuration
        lib: {
          entry: resolve(__dirname, 'src/widget.tsx'),
          name: 'TripoToWidget',
          fileName: 'tripoto-widget',
          formats: ['iife']
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {}
          }
        }
      }),
      
      ...(!isWidget && {
        // Regular app build configuration
        rollupOptions: {
          input: {
            main: resolve(__dirname, 'index.html'),
          },
        }
      })
    },
    
    // Development server
    server: {
      port: 3000,
      host: true,
    },
    
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_MODE__: JSON.stringify(mode),
    },
    
    // CSS
    css: {
      postcss: './postcss.config.js',
    },
    
    // Optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-hot-toast',
        '@tanstack/react-query',
        'framer-motion',
        'lucide-react',
        'leaflet',
        '@heroicons/react/24/outline',
        'html2canvas',
        'jspdf'
      ],
      exclude: [
        'react-virtual'
      ]
    }
  }
}) 