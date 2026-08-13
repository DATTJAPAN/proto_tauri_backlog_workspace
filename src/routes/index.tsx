import {createFileRoute, redirect} from '@tanstack/react-router'

import {backlog} from '@/backlog/backlog'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    throw redirect({
      to: await backlog.isConnected() ? '/dashboard' : '/on-boarding',
    })
  },
})
