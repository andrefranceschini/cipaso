import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '../dist')

// O emptyOutDir do Vite não remove o dist neste ambiente (OneDrive), o que deixa
// assets antigos no build e, sem isso, no deploy. Limpeza explícita antes do build.
fs.rmSync(distDir, { recursive: true, force: true })
console.log('[clean] dist removido')
