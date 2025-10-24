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
      <head>
        {/* Meta tags para segurança */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
