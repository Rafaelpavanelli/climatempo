import { Providers } from './provider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Climatizador',
  description: 'Projeto gerado em next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={"md:w-screen md:h-screen flex flex-col justify-center items-center md:p-8 p-2 md:mb-0 mb-20"}><Providers>{children}</Providers></body>
    </html>
  )
}
