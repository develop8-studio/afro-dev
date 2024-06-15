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

import Header from "@/components/header";
import UserMenu from "@/components/user";
import SettingsMenu from "@/components/settings";
import MobileSheet from "@/components/mobile-sheet";

export default function SupportPage() {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <Head>
                <title>Support -Afro.dev</title>
            </Head>
            <Header current="settings" />
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
                <div className="mx-auto grid w-full max-w-6xl gap-2">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                </div>
                <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
                    <SettingsMenu current="support" />
                    <div className="grid gap-6">
                        <Card x-chunk="dashboard-04-chunk-1">
                            <CardHeader>
                                <h3 className="text-xl font-semibold">Account Creation</h3>
                                <CardDescription>Creating an account is simple and flexible. You can sign up using your email and a password, or you can link your Google account for a quicker setup.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="mx-5">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I create an account?</AccordionTrigger>
                                    <AccordionContent className="font-normal">
                                        You can create an account using your email and password or by linking your Google account. Just follow the prompts on the sign-up page.
                                    </AccordionContent>
                                </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                        <Card x-chunk="dashboard-04-chunk-2">
                            <CardHeader>
                                <h3 className="text-xl font-semibold">Profile Settings</h3>
                                <CardDescription>Once your account is created, you can personalize your profile by setting your icon and username through the Settings page.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="mx-5">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How can I set my icon and username?</AccordionTrigger>
                                    <AccordionContent className="font-normal">
                                        Go to the <Link href="/settings/account" className="underline">Settings</Link> page after creating your account. There, you can upload an icon and set your username to personalize your profile.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Can I link my Google account after creating my account with email and password?</AccordionTrigger>
                                    <AccordionContent className="font-normal">
                                        Yes, you can link your Google account at any time through the <Link href="/settings/integrations" className="underline">Settings</Link> page.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How do I switch between Light Mode and Dark Mode?</AccordionTrigger>
                                    <AccordionContent className="font-normal">
                                        Navigate to the <Link href="/settings" className="underline">Settings</Link> page where you can select either Light Mode or Dark Mode to suit your preference.
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
