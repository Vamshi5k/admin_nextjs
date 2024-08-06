"use client";

import React, { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash } from 'lucide-react';
import axiosInstance from '@/app/Instance';

interface SubCategory {
  id: number;
  parentCategoryId: number;
  subcategory: string;
  description: string;
}

const SubCategories: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedSubId, setSelectedSubId] = useState<number | string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/subcategories');
        setSubCategories(response.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Error fetching subcategories.');
        toast({
          description: 'Error fetching subcategories.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  const handleDeleteConfirm = async () => {
    if (selectedSubId !== null) {
      try {
        await axiosInstance.delete(`/subcategories/${selectedSubId}`);
        setSubCategories(subCategories.filter(item => item.id !== selectedSubId));
        toast({
          description: 'Sub Category deleted successfully',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error deleting the Sub Category');
        toast({
          description: 'Error deleting the Sub Category',
          variant: 'destructive',
        });
      } finally {
        setOpenDialog(false);
        setSelectedSubId(null);
      }
    }
  };

  const totalCategories = subCategories.length;
  const totalPages = Math.ceil(totalCategories / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = subCategories.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteClick = (id: number | string) => {
    setSelectedSubId(id);
    setOpenDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedSubId(null);
  };

  return (
    <div className='mt-10'>
      <Card>
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Sub Categories</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {totalCategories} categories</CardDescription>
            </div>
            <div>
              <Link href='/categories/addsub'>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Sub Category
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className='text-black font-semibold'>ID</TableHead>
                <TableHead className='text-black font-semibold'>CATEGORY ID</TableHead>
                <TableHead className='text-black font-semibold'>NAME</TableHead>
                <TableHead className='text-black font-semibold'>DESCRIPTION</TableHead>
                <TableHead className='text-black font-semibold text-left'>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(itemsPerPage)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className='text-center text-red-500'>
                    {error}
                  </TableCell>
                </TableRow>
              ) : currentCategories.length > 0 ? (
                currentCategories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className='font-semibold'>{item.id}</TableCell>
                    <TableCell className='font-semibold'>{item.parentCategoryId}</TableCell>
                    <TableCell className='font-semibold'>{item.subcategory}</TableCell>
                    <TableCell className='font-semibold'>{item.description}</TableCell>
                    <TableCell>
                      <Link href={`/categories/editsub/${item.id}`}>
                        <Button
                          variant="outline"
                          size="icon"
                          className='me-3'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this category? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Yes, Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center'>
                    No Sub Categories
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

export default SubCategories;


