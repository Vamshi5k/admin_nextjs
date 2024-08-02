"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import { useRouter } from 'next/navigation';

// Define TypeScript interfaces for order data
interface Product {
    id: number;
    name: string;
    quantity: number;
}

interface CustomerDetails {
    name: string;
}

interface Order {
    id: number;
    orderId: number;
    customerDetails: CustomerDetails;
    products: Product[];
    totalCost: number;
    status: number;
}

const ProcessOrder: React.FC = () => {
    const [newOrders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const getNewOrders = async () => {
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const orders = res.data.filter((item: Order) => item?.status === 1);
                setOrders(orders);
            }
        } catch (error) {
            console.error('Error fetching new orders:', error);
            setError('Failed to load new orders. Please try again later.');
        }
    };

    useEffect(() => {
        getNewOrders();
    }, []);

    const handleViewOrder = (orderId: number) => {
        router.push(`/orders/${orderId}`);
    };

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {error && <div className="text-red-600">{error}</div>}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-black font-semibold'>S.NO</TableHead>
                            <TableHead className='text-black font-semibold'>ORDER ID</TableHead>
                            <TableHead className='text-black font-semibold'>CUSTOMER</TableHead>
                            <TableHead className='text-black font-semibold'>NO OF PRODUCTS</TableHead>
                            <TableHead className='text-black font-semibold'>AMOUNT</TableHead>
                            <TableHead className='text-black font-semibold'>STATUS</TableHead>
                            <TableHead className='text-black font-semibold'>ACTION</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {newOrders.length > 0 ? (
                            newOrders.map((item, index) => (
                                <TableRow key={item?.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className='font-bold'>#{item?.orderId}</TableCell>
                                    <TableCell>{item?.customerDetails?.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item?.products?.length}</Badge>
                                    </TableCell>
                                    <TableCell>₹ {item?.totalCost}</TableCell>
                                    <TableCell>
                                        <Badge variant="violetLight">Processing</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" onClick={() => handleViewOrder(item.orderId)}>
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className='text-center'>
                                    No new orders
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default ProcessOrder;
