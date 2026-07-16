import * as React from "react";
import { cn } from "../../lib/utils";
import { Settings, CreditCard, LayoutDashboard, LogOut, User, Crown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./dropdown-menu";

interface Profile {
    name: string;
    email: string;
    initials: string;
    role: string;
}

interface MenuItem {
    label: string;
    action: string;
    icon: React.ReactNode;
}

interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    data: Profile;
    onNavigate: (view: string) => void;
    onLogout: () => void;
    iconOnly?: boolean;
}

export function ProfileDropdown({
    data,
    onNavigate,
    onLogout,
    iconOnly,
    className,
    ...props
}: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    
    const menuItems: MenuItem[] = [
        {
            label: "Workspace",
            action: "overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
        },
        {
            label: "My Profile",
            action: "profile",
            icon: <User className="w-4 h-4" />,
        },
        {
            label: "Account Settings",
            action: "settings",
            icon: <Settings className="w-4 h-4" />,
        }
    ];

    return (
        <div className={cn("relative", className)} {...props}>
            <DropdownMenu onOpenChange={setIsOpen}>
                <div className="group relative">
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={`flex items-center p-2 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/80 transition-all duration-200 focus:outline-none backdrop-blur-md ${iconOnly ? 'gap-0' : 'gap-4'}`}
                        >
                            {!iconOnly && (
                                <div className="text-left hidden sm:block pl-2">
                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                                        {data.name}
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400 tracking-tight leading-tight mt-0.5">
                                        {data.role.replace('ROLE_', '')}
                                    </div>
                                </div>
                            )}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-emerald-700 p-0.5 shadow-sm">
                                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-zinc-900 text-sm font-bold text-[#10b981]">
                                    {data.initials}
                                </div>
                            </div>
                        </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-56 p-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-xl shadow-zinc-900/5 dark:shadow-zinc-950/20"
                    >
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            onNavigate(item.action);
                                        }}
                                        className="w-full flex items-center p-3 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            {item.icon}
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight whitespace-nowrap group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                                                {item.label}
                                            </span>
                                        </div>
                                    </button>
                                </DropdownMenuItem>
                            ))}
                        </div>

                        <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />

                        <DropdownMenuItem asChild>
                            <button
                                type="button"
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 p-3 duration-200 bg-red-500/10 rounded-xl hover:bg-red-500/20 cursor-pointer border border-transparent hover:border-red-500/30 hover:shadow-sm transition-all group"
                            >
                                <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600" />
                                <span className="text-sm font-medium text-red-500 group-hover:text-red-600">
                                    Sign Out
                                </span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </div>
            </DropdownMenu>
        </div>
    );
}
