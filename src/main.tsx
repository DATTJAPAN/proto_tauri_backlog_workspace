import ReactDOM from 'react-dom/client'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import '../app.css'

const router = createRouter({routeTree})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('root')!

ReactDOM.createRoot(rootElement).render(<RouterProvider router={router}/>)
