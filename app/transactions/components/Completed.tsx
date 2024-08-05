"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  transaction_id: string;
  user: string;
  amount: number;
  date: string;
  time: string;
  status: number;
  product: string;
}

const Completed = () => {
  const [completed, setCompleted] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const { toast } = useToast();

  const GetCompleted = async () => {
    try {
      const res = await axiosInstance.get(`/transactions`);
      if (res?.data) {
        const completed_data = res?.data.filter((item: Transaction) => item?.status === 1);
        setCompleted(completed_data);
      }
    } catch (error) {
      console.log(error);
      setError('Error Fetching Completed Transactions');
      toast({
        description: 'Error Fetching Completed Transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCompleted();
  }, []);

  const indexofFirstTransaction = (currentPage - 1) * itemsPerPage;
  const indexofLastTransaction = indexofFirstTransaction + itemsPerPage;
  const currentTransaction = completed?.slice(indexofFirstTransaction, indexofLastTransaction);

  const handlePage = (page: number) => {
    setCurrentPage(page);
  }


  const totalPages = Math.ceil(completed.length / itemsPerPage);


  return (
    <div className='mt-10'>
      <Card >
        <CardHeader>
          <CardTitle>Completed Transactions</CardTitle>
          <CardDescription className='mt-2'>Overall {completed.length} Transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-black font-semibold'>S.NO</TableHead>
                <TableHead className='text-black font-semibold'>Transaction ID</TableHead>
                <TableHead className='text-black font-semibold'>User</TableHead>
                <TableHead className='text-black font-semibold'>Amount</TableHead>
                <TableHead className='text-black font-semibold'>Date</TableHead>
                <TableHead className='text-black font-semibold'>Time</TableHead>
                <TableHead className='text-black font-semibold'>Status</TableHead>
                <TableHead className='text-black font-semibold'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className='text-center text-red-500'>
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                currentTransaction.length > 0 ? (
                  currentTransaction.map((item: Transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{indexofFirstTransaction + index + 1}</TableCell>
                      <TableCell className='font-bold'>#{item?.transaction_id}</TableCell>
                      <TableCell>{item?.user}</TableCell>
                      <TableCell>₹ {item?.amount}</TableCell>
                      <TableCell>{new Date(item?.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(item?.date).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge variant={item?.status === 1 ? "success" : "default"}>
                          {item?.status === 1 ? 'Completed' : `Status ${item?.status}`}
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
                    <TableCell colSpan={8} className='text-center'>
                      No completed transactions
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className='mt-3'>
        <Pagination>
          <PaginationContent>
            <PaginationItem aria-disabled={loading || currentPage === 1}>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePage(currentPage - 1);
                }}
                aria-disabled={loading || currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index} aria-current={currentPage === index + 1 ? "page" : undefined}>
                <PaginationLink onClick={(e) => {
                  e.preventDefault();
                  handlePage(index + 1);
                }}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem aria-disabled={loading || currentPage === totalPages}>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePage(currentPage + 1);
                }}
                aria-disabled={loading || currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>

  );
};

export default Completed;
