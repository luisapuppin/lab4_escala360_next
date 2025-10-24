import './globals.css'

export const metadata = {
  title: 'Escala360 - Sistema de Gestão de Escalas',
  description: 'Sistema completo para gestão de escalas de profissionais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
