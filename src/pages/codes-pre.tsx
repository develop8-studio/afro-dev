import Head from "next/head"
import Header from "@/components/header"
import useAuthRedirect from "@/components/useAuthRedirect"
import Layout from "@/components/Layout"
import CodeShare from "@/components/CodeShare"

export default function CodesPage() {
  useAuthRedirect();
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Head>
        <title>Codes - Afro.dev</title>
      </Head>
      <Header current="codes" />
      <Layout>
        <CodeShare />
      </Layout>
    </div>
  )
}