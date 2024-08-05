"use client";
import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Attempted from './components/Attempted';
import Completed from './components/Completed';
import Cancelled from './components/Cancelled';
import Failed from './components/Failed';
import Refunded from './components/Refunded';


const Transactions = () => {
    return (
        <div>
            <Tabs defaultValue="Attempted" className="w-full">
                <div className='flex justify-between items-center mb-4'>
                    <TabsList>
                        <TabsTrigger value="Attempted">Attempted</TabsTrigger>
                        <TabsTrigger value="Completed">Completed</TabsTrigger>
                        <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                        <TabsTrigger value="Failed">Failed</TabsTrigger>
                        <TabsTrigger value="Refunded">Refunded</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="Attempted">
                    <Attempted />
                </TabsContent>
                <TabsContent value="Completed">
                    <Completed />
                </TabsContent>
                <TabsContent value="Cancelled">
                    <Cancelled />
                </TabsContent>
                <TabsContent value="Failed">
                    <Failed />
                </TabsContent>
                <TabsContent value="Refunded">
                    <Refunded />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Transactions;
