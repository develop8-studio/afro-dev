"use client"

import Link from "next/link"
import * as React from "react"
import {
    CalendarIcon,
    EnvelopeClosedIcon,
    FaceIcon,
    GearIcon,
    PersonIcon,
    RocketIcon,
} from "@radix-ui/react-icons"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import {
    Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardDescription } from "@/components/ui/card"
import { FaRegBell } from "react-icons/fa6"
import { IoSearch } from "react-icons/io5"

export default function ProductsEditPage() {
    const [open, setOpen] = React.useState(false)

    const toggleDialog = () => {
        setOpen((open) => !open)
    }

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setOpen((open) => !open)
            }
    }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <div className="relative ml-auto flex-1 md:grow-0">
            {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground hidden md:block" /> */}
            {/* <Card className="w-full rounded-lg bg-background pl-4 md:pl-8 md:w-[200px] lg:w-[350px] shadow-none" onClick={toggleDialog}>
                {/* <CardDescription className="text-sm py-[7.5px] hidden lg:block">
                    Ready to search? Hit the {" "}
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>J
                    </kbd>
                    {" "} key!
                </CardDescription>
                <CardDescription className="text-sm py-[7.5px] hidden md:block lg:hidden">
                    Hit the {" "}
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>J
                    </kbd>
                    {" "} key!
                </CardDescription>
                <CardDescription className="text-sm py-[7.5px] block md:hidden">
                    <FaRegBell />
                </CardDescription>
                <FaRegBell />
            </Card> */}
            <div className="flex mb-1">
                <IoSearch onClick={toggleDialog} size="22.5" className="text-slate-500 cursor-pointer mr-2.5" />
                <FaRegBell size="22.5" className="text-slate-500 cursor-pointer " />
            </div>
            {/* <Input
                type="search"
                placeholder="Search ..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            /> */}
            {/* <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                    <FaceIcon className="mr-2 h-4 w-4" />
                    <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                    <RocketIcon className="mr-2 h-4 w-4" />
                    <span>Launch</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem>
                    <PersonIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                    <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                    <span>Mail</span>
                    <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                    <GearIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                </CommandGroup>
                </CommandList>
            </CommandDialog> */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <Link href="/tools"><CommandItem>
                    <RocketIcon className="mr-2 h-4 w-4" />
                    <span>Tools</span>
                    </CommandItem></Link>
                    <Link href="/threads"><CommandItem>
                    <FaceIcon className="mr-2 h-4 w-4" />
                    <span>Threads</span>
                    </CommandItem></Link>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <Link href="/settings"><CommandItem>
                        <GearIcon className="mr-2 h-4 w-4" />
                        <span>General</span>
                    </CommandItem></Link>
                    <Link href="/settings/account"><CommandItem>
                        <PersonIcon className="mr-2 h-4 w-4" />
                        <span>Account</span>
                    </CommandItem></Link>
                </CommandGroup>
                </CommandList>
            </CommandDialog>
        </div>
    )
}