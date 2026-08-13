import {createFileRoute, redirect} from '@tanstack/react-router'

import {backlog} from '@/backlog/backlog'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({
      to: backlog.isConnected() ? '/dashboard' : '/on-boarding',
    })
  },
})
