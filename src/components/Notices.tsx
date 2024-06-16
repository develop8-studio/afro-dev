import React from "react";
import { FiBell } from "react-icons/fi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Notices: React.FC = () => {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="pb-1">
                <FiBell size="22.5" className="text-slate-500 dark:text-slate-300 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Nothing yet</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notices;
