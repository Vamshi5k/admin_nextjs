"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package2, Home, ShoppingCart, Package, Users, Tag, Wallet, Hexagon, Pencil, Bell, ChevronLeft, ChevronRight, LayoutDashboard, Tags, ShoppingBasket, DraftingCompass, Star, LucideIcon, Headset } from "lucide-react";
import Link from "next/link";
import { Nav } from "./Nav";
import { Button } from "./ui/button";

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const ToggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const links: {
        title: string;
        icon: LucideIcon;
        variant: "ghost" | "default";
        href: string;
        hasDropdown?: boolean;
        dropdownLinks?: { title: string; href: string; }[];
        badge?: number;
    }[] = [
            { title: "Dashboard", icon: LayoutDashboard, variant: "default", href: '/' },
            {
                title: "Categories", icon: Tags, variant: "ghost", href: '/categories', hasDropdown: true, dropdownLinks: [
                    { title: "All Categories", href: '/categories' },
                    { title: "Sub Category", href: '/categories/sub' },
                    { title: "Child Category", href: '/categories/child' }
                ]
            },
            { title: "UsersList", icon: Users, variant: "ghost", href: '/userslist' },
            { title: "Products", icon: ShoppingBasket, variant: "ghost", href: '/products' },
            { title: "Brands", icon: DraftingCompass, variant: "ghost", href: '/brands' },
            { title: "Orders", icon: Package, variant: "ghost", href: '/orders' },
            { title: "Coupons", icon: Tag, variant: "ghost", href: '/coupons' },
            { title: "Transactions", icon: Wallet, variant: "ghost", href: '/transactions' },
            { title: "Reviews", icon: Star, variant: "ghost", href: '/reviews' },
            { title: "Support", icon: Headset, variant: "ghost", href: '/support' },
        ];


    return (
        <motion.div
            className="relative px-3 pb-10 bg-white"
            initial={{ width: "80px" }}
            animate={{ width: isCollapsed ? "80px" : "250px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="absolute right-[-20px] top-8">
                <Button variant={"secondary"} className="rounded-full p-2" onClick={ToggleNavbar}>
                    {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>

            <div className="flex flex-col h-full">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Package2 className="h-6 w-6" />
                        <span className={isCollapsed ? "hidden" : ""}>Among Us</span>
                    </Link>
                </div>

                <div className="flex-1 overflow-auto">
                    <Nav links={links} isCollapsed={isCollapsed} />
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
