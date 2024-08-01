"use client";
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListFilter } from 'lucide-react';
import NewOrders from './components/NewOrders';
import ProcessOrder from './components/ProcessOrder';
import Shipping from './components/Shipping';
import Delivered from './components/Delivered';
import Return from './components/Return';
import Cancelled from './components/Cancelled';

type Checked = DropdownMenuCheckboxItemProps["checked"]
const Orders = () => {
    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)

    return (
        <div>
            <Tabs defaultValue="New" className="w-full">
                <div className='flex justify-between items-center'>
                    <TabsList>
                        <TabsTrigger value="New">New Orders</TabsTrigger>
                        <TabsTrigger value="Processed">Processed Orders</TabsTrigger>
                        <TabsTrigger value="Shipping">Shipping</TabsTrigger>
                        <TabsTrigger value="Delivered">Delivered</TabsTrigger>
                        <TabsTrigger value="Return">Return / Replacement</TabsTrigger>
                        <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 gap-1 text-sm"
                            >
                                <ListFilter className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only">Filter</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem
                                checked={showStatusBar}
                                onCheckedChange={setShowStatusBar}
                            >
                                Status Bar
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={showActivityBar}
                                onCheckedChange={setShowActivityBar}
                                disabled
                            >
                                Activity Bar
                            </DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem
                                checked={showPanel}
                                onCheckedChange={setShowPanel}
                            >
                                Panel
                            </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <TabsContent value="New">
                    <NewOrders />
                </TabsContent>
                <TabsContent value="Processed">
                    <ProcessOrder />
                </TabsContent>
                <TabsContent value="Shipping">
                    <Shipping />
                </TabsContent>
                <TabsContent value="Delivered">
                    <Delivered />
                </TabsContent>
                <TabsContent value="Return">
                    <Return />
                </TabsContent>
                <TabsContent value="Cancelled">
                    <Cancelled />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Orders