import Link from "next/link"

export default function SettingsList({ current }: { current: string }) {
    return (
            <nav
                className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
            >
                <Link href="/ja/settings" className={current === "general" ? "font-semibold text-primary" : ""}>一般
                </Link>
                <Link href="/ja/settings/account" className={current === "account" ? "font-semibold text-primary" : ""}>アカウント
                </Link>
                <Link href="/ja/settings/security" className={current === "security" ? "font-semibold text-primary" : ""}>セキュリティ</Link>
                <Link href="/ja/settings/integrations" className={current === "integrations" ? "font-semibold text-primary" : ""}>統合</Link>
                <Link href="/ja/settings/support" className={current === "support" ? "font-semibold text-primary" : ""}>サポート</Link>
                <Link href="/ja/settings/organizations" className={current === "organizations" ? "font-semibold text-primary" : ""}>団体</Link>
                <Link href="/ja/settings/advanced" className={current === "advanced" ? "font-semibold text-primary" : ""}>アドバンスド</Link>
            </nav>
    )
}
