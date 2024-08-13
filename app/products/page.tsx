"use client";

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { File, ListFilter, Pencil, Plus, PlusCircle, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge';
import axiosInstance from '../Instance';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  image: any;
  productname: string;
  price: number;
  saleprice: number;
  qty: number;
  type: string;
  status: string;
  isActive: number; 
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(7);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [filters, setFilters] = useState<{ mattress: boolean; pillows: boolean }>({
    mattress: true,
    pillows: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/products');
        setProducts(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteConfirm = async () => {
    if (selectedProductId) {
      try {
        await axiosInstance.delete(`/products/${selectedProductId}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== selectedProductId)
        );
        toast({ description: 'Product deleted successfully', variant: 'success' });
      } catch (err) {
        toast({ description: 'Error deleting the product', variant: 'destructive' });
      } finally {
        setOpenDialog(false);
        setSelectedProductId(null);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: 'mattress' | 'pillows') => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSwitchChange = async (id: string) => {
    try {
      const product = products.find(item => item.id === id);
      if (product) {
        const updatedProduct = { ...product, isActive: product.isActive === 1 ? 0 : 1 };
        await axiosInstance.put(`/products/${id}`, updatedProduct); 
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === id ? updatedProduct : p))
        );
        toast({ description: 'Product status updated successfully', variant: 'success' });
      }
    } catch (err) {
      toast({ description: 'Error updating product status', variant: 'destructive' });
    }
  };

  const filteredProducts = products.filter((item) => {
    if (filters.mattress && item.type === "Mattress") return true;
    if (filters.pillows && item.type === "Pillow") return true;
    return false;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderTableContent = () => {
    if (loading) {
      return (
        <TableBody>
          {[...Array(itemsPerPage)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-6 w-10" /></TableCell>
              <TableCell className='font-semibold'>
                <div className='flex items-center gap-2'>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-6 w-40" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
              <TableCell><Skeleton className="h-6 w-20" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    }

    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }

    return (
      <TableBody>
        {currentProducts.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
            <TableCell className='font-semibold'>
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage src={item?.image} width={40} className='rounded-lg' />
                </Avatar>
                {item.productname}
              </div>
            </TableCell>
            <TableCell>₹ {item?.price}</TableCell>
            <TableCell>₹ {item?.saleprice}</TableCell>
            <TableCell><Badge variant="outline">{item.qty}</Badge></TableCell>
            <TableCell>
              <Badge variant={item.type === "Mattress" ? "success" : "warning"}>{item.type}</Badge>
            </TableCell>
            <TableCell>
              <Switch 
                checked={item.isActive === 1} 
                onCheckedChange={() => handleSwitchChange(item.id)} 
              />
            </TableCell>
            <TableCell>
              <Badge variant={item.isActive === 1 ? "success" : "error"}>
                {item.isActive === 1 ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={item.status === "0" ? "secondary" : "error"}>
                {item.status === "0" ? 'In Stock' : "Out Of Stock"}
              </Badge>
            </TableCell>
            <TableCell>
              <Link href={`/products/editproduct/${item.id}`}>
                <Button variant="outline" size="icon" className='me-3' aria-label={`Edit ${item.productname}`}>
                  <Pencil className='h-4 w-4' />
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => {
                    setSelectedProductId(item.id);
                    setOpenDialog(true);
                  }} disabled={loading} aria-label={`Delete ${item.productname}`}>
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
                    <AlertDialogCancel onClick={() => {
                      setOpenDialog(false);
                      setSelectedProductId(null);
                    }}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Yes, Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Products</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {products.length} Products</CardDescription>
            </div>

            <div className='flex flex-row items-center'>
              <div className="mr-3 flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-10 gap-1 rounded-lg">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by Categories</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked={filters?.mattress} onCheckedChange={() => handleFilterChange('mattress')}>
                      Mattress
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={filters?.pillows} onCheckedChange={() => handleFilterChange('pillows')}>
                      Pillows
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href='/products/addproduct'>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Product
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
                <TableHead className='text-black font-semibold'>PRODUCT</TableHead>
                <TableHead className='text-black font-semibold'>PRICE</TableHead>
                <TableHead className='text-black font-semibold'>SALE PRICE</TableHead>
                <TableHead className='text-black font-semibold'>QTY</TableHead>
                <TableHead className='text-black font-semibold'>TYPE</TableHead>
                <TableHead className='text-black font-semibold'>SWITCH STATUS</TableHead>
                <TableHead className='text-black font-semibold'>STATUS</TableHead>
                <TableHead className='text-black font-semibold'>STOCK STATUS</TableHead>
                <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            {renderTableContent()}
          </Table>
        </CardContent>
      </Card>
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default Products;
