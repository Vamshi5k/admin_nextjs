"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import Image from 'next/image';
import No_Data from "../../../img/data.png";
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // Adjust the import path as needed

interface Product {
    id: any;
    name: string;
    quantity: number;
}

interface CustomerDetails {
    name: string;
}

interface Order {
    id: any;
    orderId: number;
    customerDetails: CustomerDetails;
    products: Product[];
    totalCost: number;
    status: number;
}

const Delivered = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const GetDeliveredOrders = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const deliveredOrders = res.data.filter((item: Order) => item?.status === 3);
                setOrders(deliveredOrders);
            }
        } catch (error: any) {
            setError('Error fetching delivered orders. Please try again later.');
            console.error('Error fetching delivered orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetDeliveredOrders();
    }, []);

    const handleViewOrder = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>Delivered Orders</CardTitle>
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
                    <div className='text-red-500'>{error}</div>
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
                            {orders.map((item: Order, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className='font-bold'>#{item.orderId}</TableCell>
                                    <TableCell>{item.customerDetails.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.products.length}</Badge>
                                    </TableCell>
                                    <TableCell>₹ {item.totalCost.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="success">Delivered</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" onClick={() => handleViewOrder(item?.id)}>
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className='flex justify-center items-center h-[calc(60vh-4rem)]'>
                        <Image src={No_Data} width={500} alt='No Data' />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default Delivered;
