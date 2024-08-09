"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, useToast } from '@/components/ui/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    const getOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.get('/neworders');
            if (res?.data) {
                const filteredOrders = res.data.filter((item: Order) => item?.status === 1);
                setOrders(filteredOrders);
            }
        } catch (error) {
            console.error('Error fetching new orders:', error);
            setError('Failed to load new orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const UpdateStatusHandler = async () => {
        if (selectedOrder && selectedStatus !== null) {
            try {
                await axiosInstance.patch(`/neworders/${selectedOrder.id}`, {
                    status: selectedStatus,
                })
                toast({
                    description: "Status Updated SucessFully",
                    variant: "success",
                })

                getOrders();

            } catch (error) {
                console.log(error);
                toast({
                    description: "Error Updating The Status",
                    variant: 'destructive',
                })
            }
        }
    }

    useEffect(() => {
        getOrders();
    }, []);

    const handleViewOrder = (orderId: number) => {
        router.push(`/orders/${orderId}`);
    };

    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>Processing Orders</CardTitle>
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
                    <div className="text-center text-red-600">{error}</div>
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
                            {orders.length > 0 ? (
                                orders.map((item, index) => (
                                    <TableRow key={item?.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell className='font-bold'>#{item?.orderId}</TableCell>
                                        <TableCell>{item?.customerDetails?.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item?.products?.length}</Badge>
                                        </TableCell>
                                        <TableCell>₹ {item?.totalCost?.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Badge variant="violetLight">Processing</Badge>
                                        </TableCell>
                                        <TableCell className="flex items-center gap-3">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedOrder(item);
                                                            setSelectedStatus(item?.status);
                                                        }}
                                                    >
                                                        <Pencil className='h-4 w-4' />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-96">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Status</DialogTitle>
                                                        <DialogDescription>
                                                            Make changes to your Status here. Click save when you're done.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <Select
                                                            value={selectedStatus?.toString()}
                                                            onValueChange={(value) => setSelectedStatus(+value)}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select Status" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="0">Pending</SelectItem>
                                                                <SelectItem value="1">Processing</SelectItem>
                                                                <SelectItem value="2">Shipping</SelectItem>
                                                                <SelectItem value="3">Delivered</SelectItem>
                                                                <SelectItem value="4">Return / Replacement</SelectItem>
                                                                <SelectItem value="5">Cancelled</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="button" onClick={UpdateStatusHandler}>Update</Button>
                                                        <Button variant={"outline"}>Cancel</Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleViewOrder(item?.id)}
                                            >
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
                )}
            </CardContent>
        </Card>
    );
};

export default ProcessOrder;
