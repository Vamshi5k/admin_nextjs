import { useState } from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface NavProps {
    isCollapsed: boolean;
    links: {
        title: string;
        icon: LucideIcon;
        variant: "default" | "ghost";
        href: string;
        hasDropdown?: boolean;
        dropdownLinks?: { title: string; href: string }[];
        badge?: number;
    }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const pathName = usePathname();

    const handleDropdownToggle = (title: string) => {
        setActiveDropdown(prev => (prev === title ? null : title));
    };

    return (
        <TooltipProvider>
            <div className="flex flex-col h-full">
                <div className={`flex-1 overflow-y-auto`}>
                    <div
                        data-collapsed={isCollapsed}
                        className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
                    >
                        <nav className="relative grid gap-1 px-2">
                            {links.map((link, index) => {
                                const isActive = link.href === pathName;

                                if (link.hasDropdown) {
                                    return (
                                        <div key={index} className="flex flex-col">
                                            <button
                                                onClick={() => handleDropdownToggle(link.title)}
                                                className={cn(
                                                    buttonVariants({ variant: isActive ? 'default' : 'ghost', size: "sm" }),
                                                    link.variant === "default" &&
                                                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                                    "flex items-center justify-between w-full"
                                                )}
                                            >
                                                <div className="flex items-center">
                                                    <link.icon className={`mr-2 h-4 w-4 ${isCollapsed ? "mr-0" : ""}`} />
                                                    <span className={`${isCollapsed ? "hidden" : ""}`}>{link.title}</span>
                                                </div>
                                                {/* Clickable dropdown icon */}
                                                <div className={`ml-auto transform transition-transform duration-200 ${activeDropdown === link.title ? 'rotate-180' : ''}`}>
                                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M5.5 7l4.5 4.5L14.5 7z" />
                                                    </svg>
                                                </div>
                                                {link.badge && (
                                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                                        {link.badge}
                                                    </Badge>
                                                )}
                                            </button>
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: activeDropdown === link.title ? 'auto' : 0, opacity: activeDropdown === link.title ? 1 : 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden bg-white z-10 mt-1 rounded-md"
                                            >
                                                {link.dropdownLinks?.map((dropdownLink, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={dropdownLink.href}
                                                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${isCollapsed ? "hidden" : ""}`}
                                                    >
                                                        {dropdownLink.title}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        </div>
                                    );
                                }

                                return isCollapsed ? (
                                    <Tooltip key={index} delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={link.href}
                                                className={cn(
                                                    buttonVariants({ variant: isActive ? 'default' : 'ghost', size: "icon" }),
                                                    "h-9 w-9",
                                                    link.variant === "default" &&
                                                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                                )}
                                            >
                                                <link.icon className="h-4 w-4" />
                                                <span className="sr-only">{link.title}</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="flex items-center gap-4">
                                            {link.title}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className={cn(
                                            buttonVariants({ variant: isActive ? 'default' : 'ghost', size: "sm" }),
                                            link.variant === "default" &&
                                            "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                            "justify-start"
                                        )}
                                    >
                                        <link.icon className="mr-2 h-4 w-4" />
                                        {link.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
