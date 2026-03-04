import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Design system imports (variables and global reset) - added
import './styles/variables.css'
import './styles/typography.css'
import './styles/global.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
