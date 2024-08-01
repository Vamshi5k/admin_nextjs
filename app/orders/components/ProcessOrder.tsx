"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';

const ProcessOrder = () => {
    const [neworders, setOrders] = useState<any>([]);

    const GetNewOrders = async () => {
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const orders = res.data.filter((item: any) => item?.status === 2);
                setOrders(orders);
            }
        } catch (error) {
            console.error('Error fetching new orders:', error);
        }
    };

    useEffect(() => {
        GetNewOrders();
    }, []);

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>New Orders</CardTitle>
            </CardHeader>
            <CardContent>
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
                        {neworders.length > 0 ? (
                            neworders.map((item: any, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item?.order_id}</TableCell>
                                    <TableCell>{item?.customer?.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item?.products.length}</Badge>
                                    </TableCell>
                                    <TableCell>{item?.total_amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="success">Processing</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon">
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className='text-center'>
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
