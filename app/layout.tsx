import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { readThemeCookie, htmlClassForTheme } from '@/lib/settings/theme-cookie'

export const metadata: Metadata = {
  title: 'JL Tools',
  description: 'Your productivity RPG',
}

const SYSTEM_THEME_SCRIPT = `(function(){try{var m=document.cookie.match(/(?:^|; )jl-theme=([^;]+)/);var v=m?decodeURIComponent(m[1]):'system';if(v==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('jl-dark','dark');}}catch(e){}})();`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme, hue } = await readThemeCookie()
  const htmlClass = htmlClassForTheme(theme)
  const htmlStyle = { '--jl-hue': String(hue) } as React.CSSProperties

  return (
    <html lang="en" className={htmlClass} style={htmlStyle} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SYSTEM_THEME_SCRIPT }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
