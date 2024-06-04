import Head from "next/head";
import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import HeaderList from "@/components/header";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/ja/settings";

export default function Dashboard() {
    return (
        <div className="flex min-h-screen w-full flex-col">
        <Head>
            <title>サポート | Nook.to</title>
        </Head>
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <HeaderList />
            <Sheet>
            <SheetTrigger asChild>
                <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
                >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                <Link
                    href="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                >
                    <Package2 className="h-6 w-6" />
                    <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Dashboard
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Orders
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Products
                </Link>
                <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                >
                    Customers
                </Link>
                <Link href="#" className="hover:text-foreground">
                    Settings
                </Link>
                </nav>
            </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
                </div>
            </form>
            <UserMenu />
            </div>
        </header>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">設定</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsMenu current="support" />
            <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
                    <CardHeader>
                        <CardTitle>初期設定</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="mx-5">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>アカウントを新規作成するために必要なものは？</AccordionTrigger>
                            <AccordionContent>
                            ユーザーアカウントを作成するには、メールアドレスとパスワードが必要です。または、Google アカウントをお持ちであれば、それを使用して迅速に統合することもできます。
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
                <Card x-chunk="dashboard-04-chunk-2">
                    <CardHeader>
                        <CardTitle>ご利用ガイド</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="mx-5">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>さまざまな設定オプションと機能を使用するにはどうすればよいですか?</AccordionTrigger>
                            <AccordionContent>
                            設定メニューを調べて、さまざまなオプションを見つけてください。ライトモードとダークモードを切り替えることもできます。
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
            </div>
        </main>
        </div>
    )
}
