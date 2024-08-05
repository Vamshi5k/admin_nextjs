"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { Pencil, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '../Instance';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

// Define the Product type
interface Product {
  id: string;
  image: string;
  productname: string;
  price: number;
  saleprice: number;
  qty: number;
  type: string;
  status: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getProducts = async () => {
    setLoading(true);
    setError(null); 
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Error Fetching The Products Data:", error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Delete product
  const handleDeleteConfirm = async () => {
    if (selectedProductId !== null) {
      try {
        await axiosInstance.delete(`/products/${selectedProductId}`);
        setProducts(products.filter((product) => product?.id !== selectedProductId));
        toast({
          description: 'Product deleted successfully',
          variant: 'success',
        });
      } catch (error) {
        console.log('Error deleting the product');
        toast({
          description: 'Error deleting the product',
          variant: 'destructive',
        });
      } finally {
        setOpenDialog(false);
        setSelectedProductId(null);
      }
    }
  };

  const handleDeleteClick = (id: any) => {
    setSelectedProductId(id);
    setOpenDialog(true);
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  // Pagination
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Products</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {products.length} Products</CardDescription>
            </div>
            <div>
              <Link href='/products/addproduct'>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Product
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-lg md:text-xl font-semibold">Loading products...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>PRODUCT</TableHead>
                  <TableHead className='text-black font-semibold'>PRICE</TableHead>
                  <TableHead className='text-black font-semibold'>SALE PRICE</TableHead>
                  <TableHead className='text-black font-semibold'>QTY</TableHead>
                  <TableHead className='text-black font-semibold'>TYPE</TableHead>
                  <TableHead className='text-black font-semibold'>STATUS</TableHead>
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{indexOfFirstProduct + index + 1}</TableCell>
                    <TableCell className='font-semibold'>
                      <div className='flex items-center gap-2'>
                        <Avatar>
                          <AvatarImage src={item.image} width={40} className='rounded-lg' />
                        </Avatar>
                        {item.productname}
                      </div>
                    </TableCell>
                    <TableCell>₹ {item.price.toFixed(2)}</TableCell>
                    <TableCell>₹ {item.saleprice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.qty}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.type === "Mattress" ? "success" : "warning"}>{item.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "0" ? "secondary" : "error"}>
                        {item.status === "0" ? 'In Stock' : "Out Of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/products/editproduct/${item.id}`}>
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
                              Are you sure you want to delete this product? This action cannot be undone.
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
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className='mt-3'>
        <Pagination>
          <PaginationContent>
            <PaginationItem aria-disabled={currentPage === 1}>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index} aria-current={currentPage === index + 1 ? 'page' : undefined}>
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
            <PaginationItem aria-disabled={currentPage === totalPages}>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

    </div>
  );
};

export default Products;
