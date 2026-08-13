import type {PropsWithChildren} from 'react'

export function EmptyShell({children}: PropsWithChildren) {
  return (
    <main className="grid min-h-svh w-full place-items-center bg-background p-4 sm:p-6">
      {children}
    </main>
  )
}
