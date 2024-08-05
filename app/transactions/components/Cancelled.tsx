"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface Transaction {
  transaction_id: string;
  user: string;
  amount: number;
  date: string;
  time: string;
  status: number;
  product: string;
}

const Cancelled = () => {
  const [cancelled, setCancelled] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const { toast } = useToast();

  const GetCancelled = async () => {
    try {
      const res = await axiosInstance.get(`/transactions`);
      if (res?.data) {
        const cancelled_data = res?.data.filter((item: Transaction) => item?.status === 2);
        setCancelled(cancelled_data);
      }
    } catch (error) {
      console.log(error);
      setError('Error Fetching Cancelled Transactions');
      toast({
        description: 'Error Fetching Cancelled Transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetCancelled();
  }, []);

  const indexofFirstTransaction = (currentPage - 1) * itemsPerPage;
  const indexofLastTransaction = indexofFirstTransaction + itemsPerPage;
  const currentTransaction = cancelled?.slice(indexofFirstTransaction, indexofLastTransaction);


  const totalPages = Math.ceil(cancelled?.length / itemsPerPage);


  const HandlePage = (page: number) => {
    setCurrentPage(page);
  }



  return (
    <div className='mt-10'>
      <Card >
        <CardHeader>
          <CardTitle>Cancelled Transactions</CardTitle>
          <CardDescription className='mt-2'>Overall {cancelled?.length} Transactions</CardDescription>
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
                currentTransaction?.length > 0 ? (
                  currentTransaction?.map((item: Transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{indexofFirstTransaction + index + 1}</TableCell>
                      <TableCell className='font-bold'>#{item?.transaction_id}</TableCell>
                      <TableCell>{item?.user}</TableCell>
                      <TableCell>₹ {item?.amount}</TableCell>
                      <TableCell>{new Date(item?.date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(item?.date).toLocaleTimeString()}</TableCell>
                      <TableCell>
                        <Badge variant={item?.status === 2 ? "error" : "default"}>
                          {item?.status === 2 ? 'Cancelled' : `Status ${item?.status}`}
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
              <PaginationPrevious onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) HandlePage(currentPage - 1);
              }}
                aria-disabled={loading || currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index} aria-current={currentPage === index + 1 ? "page" : undefined}>
                <PaginationLink onClick={(e) => {
                  e.preventDefault();
                  HandlePage(index + 1);
                }}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem aria-disabled={loading || currentPage === totalPages}>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) HandlePage(currentPage + 1);
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

export default Cancelled;
