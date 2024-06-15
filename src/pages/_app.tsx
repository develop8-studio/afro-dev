import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from '@/components/theme-provider'
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Head>
        <title>Afro.dev</title>
        <link rel="icon" href="/afro-dark-logo.png" />
        <link rel="apple-touch-icon" href="/afro-mobile-icon.png" />
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
      </Head>
      <div className="m-0 p-0">
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  )
}