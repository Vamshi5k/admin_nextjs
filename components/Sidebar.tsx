"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Newspaper,
    Folders,
    CreditCard,
    Settings,
    User,
    ChevronRight,
    ChevronLeft
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
                    { title: "Posts", icon: Newspaper, variant: "ghost", href: '/posts' },
                    { title: "Categories", icon: Folders, variant: "ghost", href: '/categories' },
                    { title: "Transactions", icon: CreditCard, variant: "ghost", href: '/transactions' },
                    { title: "Profile", icon: User, variant: "ghost", href: '/profile' },
                    { title: "Settings", icon: Settings, variant: "ghost", href: '/settings' },
                ]}
            />
        </motion.div>
    );
};

export default Sidebar;
