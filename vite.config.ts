import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create a chunk for each page component
          if (id.includes('/src/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0].toLowerCase();
            return `page-${pageName}`;
          }
          
          // Create a chunk for UI components
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          
          // Create a chunk for non-UI components
          if (id.includes('/src/components/') && !id.includes('/src/components/ui/')) {
            return 'components';
          }
          
          // Create chunks for major vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) {
              return 'vendor-radix';
            }
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-react-query';
            }
            if (id.includes('xlsx')) {
              return 'vendor-xlsx';
            }
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
