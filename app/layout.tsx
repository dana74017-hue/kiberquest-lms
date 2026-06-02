import dynamic from 'next/dynamic'
import { ThemeProvider } from "@/components/ThemeProvider";
const Navbar = dynamic(() => import('@/components/ui/Navbar'), { ssr: false })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}