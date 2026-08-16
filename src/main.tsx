import ReactDOM from 'react-dom/client'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/react-router-devtools'
import {routeTree} from './routeTree.gen'
import '../app.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Keep cached data fresh for 5 minutes
            refetchOnWindowFocus: false, // Prevent refetching when switching desktop window focus
        },
    },
})

const isDebug = import.meta.env.VITE_APP_DEBUG === 'true'

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
            {isDebug && (
                <>
                    <ReactQueryDevtools initialIsOpen={false}/>
                    <TanStackRouterDevtools router={router} initialIsOpen={false}/>
                </>
            )}
        </QueryClientProvider>
    )
}