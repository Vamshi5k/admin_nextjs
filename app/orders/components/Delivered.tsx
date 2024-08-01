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

const Delivered = () => {
    const [neworders, setOrders] = useState<any>([]);

    const GetNewOrders = async () => {
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const orders = res.data.filter((item: any) => item?.status === 4);
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
                <CardTitle>Delivered Orders</CardTitle>
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
                            {neworders.map((item: any, index: number) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item?.order_id}</TableCell>
                                    <TableCell>{item?.customer?.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item?.products.length}</Badge>
                                    </TableCell>
                                    <TableCell>{item?.total_amount}</TableCell>
                                    <TableCell>
                                        <Badge variant="violetLight">{item?.status === 4 ? "Delivered" : ""}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="icon">
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
