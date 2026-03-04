import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    // Custom plugin to inject USB permissions policy
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        // Inject USB permissions
        let transformed = html.replace(
          '<head>',
          '<head>\n    <meta http-equiv="Permissions-Policy" content="usb=*">'
        );
        
        // VERSION 2.3.2 - Grand Palace Casino Dedicated Edition
        transformed = transformed.replace(
          /<meta name="version" content="[^"]*" \/>/,
          '<meta name="version" content="2.3.2" />'
        );
        transformed = transformed.replace(
          /<meta name="build-date" content="[^"]*" \/>/,
          '<meta name="build-date" content="2026-03-04" />'
        );
        transformed = transformed.replace(
          /const buildVersion = '[^']*';/,
          "const buildVersion = '2.3.2';"
        );
        transformed = transformed.replace(
          /const buildDate = '[^']*';/,
          "const buildDate = '2026-03-04';"
        );
        
        return transformed;
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'sonner',
      'motion',
      'next-themes',
      '@emailjs/browser',
      'xlsx',
      'jspdf',
      'jspdf-autotable',
    ],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  
  // Development server configuration
  server: {
    headers: {
      'Permissions-Policy': 'usb=*',
    },
  },
})
