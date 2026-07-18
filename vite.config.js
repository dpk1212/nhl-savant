import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync, statSync } from 'fs'
import { join } from 'path'

// Strip server-only fields from the big wallet JSONs in dist/ AFTER the
// public/ copy. The repo copies stay intact (scripts read them from disk);
// only the browser-served files are slimmed. Frontend audit (2026-07-18):
//   whale_profiles.pnlHistory   ~500KB — never rendered client-side
//   sports_sharps.recentResults ~600KB — mapped into vault entries but no
//                                        component consumes it
// Combined this removes ~1.1MB from every page load.
function slimPublicJson() {
  const STRIP = {
    'whale_profiles.json': ['pnlHistory'],
    'sports_sharps.json': ['recentResults'],
  }
  return {
    name: 'slim-public-json',
    apply: 'build',
    closeBundle() {
      for (const [file, fields] of Object.entries(STRIP)) {
        const p = join('dist', file)
        if (!existsSync(p)) continue
        const before = statSync(p).size
        const data = JSON.parse(readFileSync(p, 'utf8'))
        for (const [key, entry] of Object.entries(data)) {
          if (key === '_meta' || !entry || typeof entry !== 'object') continue
          for (const f of fields) delete entry[f]
        }
        writeFileSync(p, JSON.stringify(data))
        const after = statSync(p).size
        console.log(`[slim-public-json] ${file}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), slimPublicJson()],
  base: '/', // Changed from '/nhl-savant/' for custom domain
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          utils: ['papaparse']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
