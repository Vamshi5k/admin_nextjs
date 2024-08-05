"use client";
import React, { useState, useEffect } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import axiosInstance from '../Instance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from "./components/Stars";
import { Badge } from '@/components/ui/badge';

interface User {
    name: string;
    profile_pic?: string;
}

interface Review {
    user: User;
    product: string;
    brand: string;
    comment: string;
    rating: number;
}

const Reviews: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(5); 

    const { toast } = useToast();

    const getReviews = async () => {
        try {
            const res = await axiosInstance.get('/reviews');
            setReviews(res.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast({
                description: 'Error fetching reviews.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getReviews();
    }, []);

    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const indexOfFirstReview = (currentPage - 1) * itemsPerPage;
    const indexOfLastReview = indexOfFirstReview + itemsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    return (
        <div className='mt-10'>
            <Card>
                <CardHeader>
                    <CardTitle>Reviews List</CardTitle>
                    <CardDescription className='mt-2'>Overall {reviews.length} Reviews</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='text-black font-semibold'>S.NO</TableHead>
                                <TableHead className='text-black font-semibold'>User</TableHead>
                                <TableHead className='text-black font-semibold'>Product</TableHead>
                                <TableHead className='text-black font-semibold'>Brand</TableHead>
                                <TableHead className='text-black font-semibold'>Rating</TableHead>
                                <TableHead className='text-black font-semibold'>Comment</TableHead>
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
                                    </TableRow>
                                ))
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center text-red-500'>
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : currentReviews.length > 0 ? (
                                currentReviews.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{indexOfFirstReview + index + 1}</TableCell>
                                        <TableCell className='font-semibold'>
                                            <div className='flex items-center gap-2'>
                                                <Avatar>
                                                    {item?.user?.profile_pic ? (
                                                        <AvatarImage src={item?.user?.profile_pic} width={40} className='rounded-lg object-cover' />
                                                    ) : (
                                                        <AvatarFallback className='flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-lg text-lg'>
                                                            {item?.user?.name ? item?.user?.name[0] : '?'}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                {item?.user?.name || 'Anonymous'}
                                            </div>
                                        </TableCell>
                                        <TableCell>{item?.product}</TableCell>
                                        <TableCell>
                                            <Badge variant={"outline"}>
                                                {item?.brand}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <StarRating rating={item?.rating} />
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" onClick={() => toast({ description: item.comment })}>
                                                View Comment
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center'>
                                        No Reviews
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

export default Reviews;
