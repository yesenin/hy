import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createHashRouter, RouterProvider } from 'react-router'
import Cards from './pages/Cards.tsx'

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'cards',
    element: <Cards />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
