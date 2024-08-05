"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    ShoppingBasket,
    Tags,
    DraftingCompass,
    Package,
    Wallet,
    Star,
    Tag,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
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

    return (
        <motion.div
            className="relative px-3 pb-10"
            initial={{ width: "80px" }}
            animate={{ width: isCollapsed ? "80px" : "250px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="absolute right-[-20px] top-8">
                <Button variant={"secondary"} className="rounded-full p-2" onClick={ToggleNavbar}>
                    {isCollapsed ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>

            <Nav
                isCollapsed={isCollapsed}
                links={[
                    { title: "Dashboard", icon: LayoutDashboard, variant: "default", href: '/' },
                    { title: "Categories", icon: Tags, variant: "ghost", href: '/categories', hasDropdown: true, dropdownLinks: [
                        { title: "All Categories", href: '/categories' },
                        { title: "Sub Category", href: '/categories/sub' },
                        { title: "Child Category", href: '/categories/child' }
                    ]},
                    { title: "UsersList", icon: Users, variant: "ghost", href: '/userslist' },
                    { title: "Products", icon: ShoppingBasket, variant: "ghost", href: '/products' },
                    { title: "Brands", icon: DraftingCompass, variant: "ghost", href: '/brands' },
                    { title: "Orders", icon: Package, variant: "ghost", href: '/orders' },
                    { title: "Coupons", icon: Tag, variant: "ghost", href: '/coupons' },
                    { title: "Transactions", icon: Wallet, variant: "ghost", href: '/transactions' },
                    { title: "Reviews", icon: Star, variant: "ghost", href: '/reviews' },
                ]}
            />
        </motion.div>
    );
};

export default Sidebar;
