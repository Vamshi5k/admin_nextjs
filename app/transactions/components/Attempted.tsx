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
    orderId: string;
    customerDetails: {
        name: string;
    };
    products: any[];
    totalCost: number;
    status: number;
    transactionId: string;
    user: string;
    time: string;
}

const Attempted: React.FC = () => {
    const [attempted, setAttempted] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    return (
        <Card className='mt-10'>
            <CardHeader>
                <CardTitle>Atempted Transactions</CardTitle>
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
                                <TableHead className='text-black font-semibold'>Transaction ID</TableHead>
                                <TableHead className='text-black font-semibold'>User</TableHead>
                                <TableHead className='text-black font-semibold'>Amount</TableHead>
                                <TableHead className='text-black font-semibold'>Time</TableHead>
                                <TableHead className='text-black font-semibold'>Status</TableHead>
                                <TableHead className='text-black font-semibold'>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attempted.length > 0 ? (
                                attempted.map((item, index) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.transactionId}</TableCell>
                                        <TableCell>{item.user}</TableCell>
                                        <TableCell>₹ {item.totalCost.toFixed(2)}</TableCell>
                                        <TableCell>{new Date(item.time).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.status === 0 ? "warning" : "default"}>
                                                {item.status === 0 ? 'Pending' : `Status ${item.status}`}
                                            </Badge>
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
                )}
            </CardContent>
        </Card>
    );
};

export default Attempted;
