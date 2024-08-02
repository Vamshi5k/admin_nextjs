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
import No_Data from "../../../img/data.png";

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
    const [neworders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const GetNewOrders = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const orders = res.data.filter((item: Order) => item?.status === 2);
                setOrders(orders);
            }
        } catch (error: any) {
            setError('Error fetching new orders. Please try again later.');
            console.error('Error fetching new orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetNewOrders();
    }, []);

    const HandleViewOrder = (orderId: number) => {
        router.push(`/orders/${orderId}`)
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div className='text-red-500'>{error}</div>;

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>Shipping Orders</CardTitle>
            </CardHeader>
            <CardContent>
                {neworders.length > 0 ? (
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
                            {neworders.map((item: Order, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className='font-bold'>#{item.orderId}</TableCell>
                                    <TableCell>{item.customerDetails.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.products.length}</Badge>
                                    </TableCell>
                                    <TableCell>₹ {item.totalCost}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Shipping</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon" onClick={() => HandleViewOrder(item?.orderId)}>
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

export default Shipping;
