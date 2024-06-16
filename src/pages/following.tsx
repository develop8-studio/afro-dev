import Head from "next/head"
import Header from "@/components/header"
import useAuthRedirect from "@/components/useAuthRedirect"
import Layout from "@/components/Layout"
import Following from "@/components/Code/Following"

export default function FollowingCodes() {
    useAuthRedirect();
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>Following -Afro.dev</title>
            </Head>
            <Header current="codes" />
            <Layout>
                <Following />
            </Layout>
        </div>
    )
}