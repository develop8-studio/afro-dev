import Head from "next/head"
import Header from "@/components/header"
import useAuthRedirect from "@/components/useAuthRedirect"
import ThreadsList from "@/components/Threads"

export default function Threads() {
  useAuthRedirect();
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Head>
        <title>Threads -Afro.dev</title>
      </Head>
      <Header current="threads" />
      <ThreadsList />
    </div>
  )
}
