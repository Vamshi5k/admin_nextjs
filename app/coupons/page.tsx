"use client";

import React, { useState, useEffect } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosInstance from '../Instance';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import couponFallback from '../../img/coupon.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash } from 'lucide-react';

interface Coupon {
    id: any;
    image: any;
    amount_of_discount: any;
    percent_of_discount: any;
    number_of_coupons: any;
    minimum_order_amount: any;
    maximum_discount: any;
}

const Coupons = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedCouponId, setselectedCouponId] = useState<string | null>(null);
    const [itemsPerPage] = useState<number>(5);
    const { toast } = useToast();

    const getCoupons = async () => {
        try {
            const res = await axiosInstance.get('/coupons');
            setCoupons(res.data || []);
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError('Error fetching coupons.');
            toast({
                description: 'Error fetching coupons.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCoupons();
    }, []);

    const indexOfFirstCoupon = (currentPage - 1) * itemsPerPage;
    const indexOfLastCoupon = indexOfFirstCoupon + itemsPerPage;
    const currentCoupons = coupons.slice(indexOfFirstCoupon, indexOfLastCoupon);
    const totalPages = Math.ceil(coupons.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedCouponId) {
            try {
                await axiosInstance.delete(`/coupons/${selectedCouponId}`);
                setCoupons(prevProducts => prevProducts.filter(coupoun => coupoun.id !== selectedCouponId));
                toast({ description: 'Coupon deleted successfully', variant: 'success' });
            } catch {
                toast({ description: 'Error deleting the product', variant: 'destructive' });
            } finally {
                setOpenDialog(false);
                setselectedCouponId(null);
            }
        }
    };

    return (
        <div className='mt-10'>
            <Card>
                <CardHeader>
                    <div className='w-full h-auto flex justify-between items-center'>
                        <div>
                            <CardTitle className="text-lg md:text-2xl font-semibold">Coupouns</CardTitle>
                            <CardDescription className='text-xs mt-1'>Overall {coupons.length} coupouns</CardDescription>
                        </div>
                        <div>
                            <Link href='/coupons/addcoupoun'>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> New Coupoun
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-black font-semibold'>S.NO</TableHead>
                                <TableHead className='text-black font-semibold'>IMAGE</TableHead>
                                <TableHead className='text-black font-semibold'>AMOUNT OF DISCOUNT</TableHead>
                                <TableHead className='text-black font-semibold'>% OF DISCOUNT</TableHead>
                                <TableHead className='text-black font-semibold'>NO OF COUPONS</TableHead>
                                <TableHead className='text-black font-semibold'>MINIMUM ORDER AMT</TableHead>
                                <TableHead className='text-black font-semibold'>MAXIMUM DISCOUNT</TableHead>
                                <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                [...Array(itemsPerPage)].map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center text-red-500'>
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : currentCoupons.length > 0 ? (
                                currentCoupons.map((item, index) => (
                                    <TableRow key={item?.id}>
                                        <TableCell className='font-semibold'>{indexOfFirstCoupon + index + 1}</TableCell>
                                        <TableCell>
                                            <Image
                                                src={item?.image && item?.image !== '0' ? item?.image : couponFallback}
                                                alt="Coupon"
                                                width={30}
                                                height={30}
                                                className='object-cover'
                                            />
                                        </TableCell>
                                        <TableCell className='font-semibold'>₹ {item?.amount_of_discount}</TableCell>
                                        <TableCell className='font-semibold'>{item?.percent_of_discount}</TableCell>
                                        <TableCell className='font-semibold'>{item?.number_of_coupons}</TableCell>
                                        <TableCell className='font-semibold'>₹ {item?.minimum_order_amount}</TableCell>
                                        <TableCell className='font-semibold'>₹ {item?.maximum_discount}</TableCell>
                                        <TableCell>
                                            <Link href={`/coupons/editcoupoun/${item?.id}`}>
                                                <Button variant="outline" size="icon" className='me-3'>
                                                    <Pencil className='h-4 w-4' />
                                                </Button>
                                            </Link>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setselectedCouponId(item?.id);
                                                        setOpenDialog(true);
                                                    }}>
                                                        <Trash className='h-4 w-4' />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this coupon? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => {
                                                            setOpenDialog(false);
                                                            setselectedCouponId(null);
                                                        }}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleDeleteConfirm}>Yes, Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className='text-center'>
                                        No Coupons
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Pagination className='mt-3'>
                <PaginationContent>
                    <PaginationItem aria-disabled={loading || currentPage === 1}>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage - 1);
                            }}
                            aria-disabled={loading || currentPage === 1}
                        />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index} aria-current={currentPage === index + 1 ? "page" : undefined}>
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(index + 1);
                                }}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem aria-disabled={loading || currentPage === totalPages}>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(currentPage + 1);
                            }}
                            aria-disabled={loading || currentPage === totalPages}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default Coupons;
