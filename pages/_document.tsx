import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="description" content="EmergencyAI - Disaster Response Coordination System" />
        <meta name="theme-color" content="#EF4444" />
        <title>EmergencyAI - Disaster Response System</title>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}