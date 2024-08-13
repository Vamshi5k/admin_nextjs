"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

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
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const router = useRouter();
    const { toast } = useToast();

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
            toast({
                description: "Error Fetching New Orders",
                variant: "destructive",
            })
        } finally {
            setLoading(false);
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
                {loading ? (
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
                            {[...Array(5)].map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
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
                                            <Badge variant={item?.status === 0 ? "warning" : "default"}>
                                                {item?.status === 0 ? "Pending" : "Not Updated"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className='flex items-center gap-3'>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleViewOrder(item?.id)}
                                            >
                                                <Eye className='h-4 w-4' aria-label="View Order" />
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
                )}
            </CardContent>
        </Card>
    );
};

export default NewOrders;
