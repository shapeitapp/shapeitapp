import '../styles/index.css'
import 'focus-visible'

export default function RootLayout({ children, session }) {
  return (
    <html className="h-full antialiased" lang="en">
      <head>
        <title>Shape It!</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex min-h-full flex-row bg-white">
        {children}
      </body>
    </html>
  );
}