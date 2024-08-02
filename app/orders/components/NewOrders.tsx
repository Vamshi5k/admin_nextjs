"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import Link from 'next/link';

interface Order {
    id: number;
    orderId: any;
    customerDetails: {
        name: string;
    };
    products: any[];
    totalCost: number;
    status: number;
}

const NewOrders: React.FC = () => {
    const [newOrders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const getNewOrders = async () => {
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const orders: Order[] = res.data.filter((item: Order) => item.status === 0);
                setOrders(orders);
            }
        } catch (error) {
            setError('Error fetching new orders.');
            console.error('Error fetching new orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getNewOrders();
    }, []);

    const HandleViewOrder = (orderId: number) => {
        router.push(`/orders/${orderId}`)
    }

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : (
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
                                    <TableRow key={item.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className='font-bold'>#{item.orderId}</TableCell>
                                        <TableCell>{item.customerDetails.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.products.length}</Badge>
                                        </TableCell>
                                        <TableCell>₹ {item.totalCost.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant="warning">Pending</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/orders/${item?.orderId}`}>
                                                <Button variant="outline" size="icon" onClick={() => HandleViewOrder(item?.orderId)}>
                                                    <Eye className='h-4 w-4' />
                                                </Button>
                                            </Link>

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
                )}
            </CardContent>
        </Card>
    );
};

export default NewOrders;
