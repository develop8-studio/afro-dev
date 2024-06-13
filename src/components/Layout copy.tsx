import React, { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <main className="flex flex-1 flex-col p-5 md:p-[30px] bg-slate-50 dark:bg-muted/40 items-center overflow-x-hidden">
            <div className="md:w-2/3 flex flex-1 flex-col gap-5">
                {children}
            </div>
        </main>
    );
}