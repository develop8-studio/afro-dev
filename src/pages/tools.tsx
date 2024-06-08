import Head from "next/head"
import Header from "@/components/header"
import useAuthRedirect from "@/components/useAuthRedirect"
import { Card, CardDescription, CardTitle, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
    useAuthRedirect();

    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>Tools -Afro.dev</title>
        </Head>
        <Header current="tools" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-slate-50">
            <div className="contents md:flex justify-center items-center">
                <Card className="mb-1 md:mr-3 w-full md:w-1/3">
                    <CardHeader>
                        <CardTitle className="font-medium">AI Generate Image</CardTitle>
                        <CardDescription className="font-light">DALL-E3</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild><Link href="/tools">Use</Link></Button>
                    </CardContent>
                </Card>
                <Card className="mb-1 md:mr-3 w-full md:w-1/3">
                    <CardHeader>
                        <CardTitle className="font-medium">Search npm package</CardTitle>
                        <CardDescription className="font-light">in all packages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild><Link href="/tools">Use</Link></Button>
                    </CardContent>
                </Card>
                <Card className="mb-3 w-full md:w-1/3">
                    <CardHeader>
                        <CardTitle className="font-medium">Search npm package</CardTitle>
                        <CardDescription className="font-light">in all packages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild><Link href="/tools">Use</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </main>
        </div>
    )
}