import {useState} from 'react'
import {Link, useNavigate, useRouter} from '@tanstack/react-router'
import {openUrl} from '@tauri-apps/plugin-opener'
import {ChevronsUpDownIcon, ExternalLinkIcon, LoaderCircleIcon, LogOutIcon, SettingsIcon, ShieldCheckIcon} from 'lucide-react'

import {backlog} from '@/backlog/backlog'
import type {BacklogUser} from '@/backlog/user'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from '@/components/ui/sidebar'

export function NavUser({user, loading}: {user: BacklogUser | null; loading: boolean}) {
  const {isMobile} = useSidebar()
  const navigate = useNavigate()
  const router = useRouter()
  const [disconnecting, setDisconnecting] = useState(false)
  const [openingSettings, setOpeningSettings] = useState(false)
  const name = user?.name ?? (loading ? 'Loading user…' : 'Backlog user')
  const email = user?.mailAddress ?? ''
  const avatar = user?.nulabAccount?.iconUrl
  const initials = user?.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'BU'

  async function logout() {
    if (disconnecting) return
    setDisconnecting(true)
    try {
      await backlog.disconnect()
      await router.invalidate()
      await navigate({to: '/on-boarding', replace: true})
    } finally {
      setDisconnecting(false)
    }
  }

  async function openPersonalSettings() {
    if (openingSettings) return
    setOpeningSettings(true)
    try {
      const connection = await backlog.getConnection()
      if (!connection) return

      const settingsUrl = new URL('/EditProfile.action', connection.spaceUrl)
      await openUrl(settingsUrl.toString())
    } finally {
      setOpeningSettings(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger disabled={loading} render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}>
            <Avatar>{avatar && <AvatarImage src={avatar} alt={name} />}<AvatarFallback>{initials}</AvatarFallback></Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
            {loading ? <LoaderCircleIcon className="ml-auto animate-spin" /> : <ChevronsUpDownIcon className="ml-auto size-4" />}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56 max-w-[calc(100vw-1rem)] rounded-lg" side={isMobile ? 'bottom' : 'right'} align="start" sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex min-w-0 items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>{avatar && <AvatarImage src={avatar} alt={name} />}<AvatarFallback>{initials}</AvatarFallback></Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link to="/auth" />}>
                <ShieldCheckIcon />
                Authentication
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void openPersonalSettings()} disabled={openingSettings}>
                {openingSettings ? <LoaderCircleIcon className="animate-spin" /> : <SettingsIcon />}
                <span className="flex-1">Personal settings</span>
                <ExternalLinkIcon className="size-3.5 text-muted-foreground" />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => void logout()} disabled={disconnecting}>
                {disconnecting ? <LoaderCircleIcon className="animate-spin" /> : <LogOutIcon />}
                {disconnecting ? 'Disconnecting…' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
