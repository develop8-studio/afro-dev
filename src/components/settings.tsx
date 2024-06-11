import Link from "next/link"

export default function SettingsList({ current }: { current: string }) {
    return (
            <nav
                className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
            >
                <Link href="/settings" className={current === "general" ? "font-semibold text-primary" : ""}>
                General
                </Link>
                <Link href="/settings/account" className={current === "account" ? "font-semibold text-primary" : ""}>
                Account
                </Link>
                <Link href="/settings/security" className={current === "security" ? "font-semibold text-primary" : ""}>Security</Link>
                <Link href="/settings/integrations" className={current === "integrations" ? "font-semibold text-primary" : ""}>Integrations</Link>
                <Link href="/support" className={current === "support" ? "font-semibold text-primary" : ""}>Support</Link>
                {/* <Link href="/settings/organizations" className={current === "organizations" ? "font-semibold text-primary" : ""}>Organizations</Link> */}
            </nav>
    )
}
