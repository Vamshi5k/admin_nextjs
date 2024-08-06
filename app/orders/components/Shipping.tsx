"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import Image from 'next/image';
import NoDataImage from "../../../img/data.png";
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you have this component

interface Order {
    id: string;
    orderId: any;
    customerDetails: {
        name: string;
    };
    products: any[];
    totalCost: number;
    status: number;
}

const Shipping = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Fetch new orders with status 'Shipping'
    const getOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/neworders');
            if (response?.data) {
                const filteredOrders = response.data.filter((order: Order) => order.status === 2);
                setOrders(filteredOrders);
            }
        } catch (error: any) {
            setError('Error fetching new orders. Please try again later.');
            console.error('Error fetching new orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    const handleViewOrder = (orderId: number) => {
        router.push(`/orders/${orderId}`);
    };

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>Shipping Orders</CardTitle>
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
                    <div className='text-red-500 text-center'>{error}</div>
                ) : orders.length > 0 ? (
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
                            {orders.map((order: Order, index: number) => (
                                <TableRow key={order.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className='font-bold'>#{order.orderId}</TableCell>
                                    <TableCell>{order.customerDetails.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{order.products.length}</Badge>
                                    </TableCell>
                                    <TableCell>₹ {order.totalCost.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Shipping</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handleViewOrder(order.orderId)}
                                        >
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className='flex justify-center items-center h-[calc(60vh-4rem)]'>
                        <Image src={NoDataImage} width={500} alt='No Data' />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Shipping;
