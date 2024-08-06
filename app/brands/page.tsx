"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosInstance from '../Instance';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton'; // Import your Skeleton component

interface Brand {
  id: string;  // Assuming id is a string; adjust if it's a number
  brandName: string;
  description: string;
  category: string;
  logo?: string;
  status: number;
  dateAdded: string;
}

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/brands');
      if (response?.data) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      setError('Error fetching brands');
      toast({
        description: 'Error Fetching The Brand Data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedBrandId(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBrandId) {
      try {
        await axiosInstance.delete(`/brands/${selectedBrandId}`);
        setBrands(prevBrands => prevBrands.filter(brand => brand.id !== selectedBrandId));
        toast({
          description: 'Brand deleted successfully',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error deleting the brand:', error);
        toast({
          description: 'Error deleting the brand',
          variant: 'destructive',
        });
      } finally {
        setOpenDialog(false);
        setSelectedBrandId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedBrandId(null);
  };

  return (
    <div className='mt-10 mb-10'>
      <Card>
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Brands</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {brands.length} Brands</CardDescription>
            </div>
            <div>
              <Link href='/brands/addbrand'>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Brand
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>BRAND NAME</TableHead>
                  <TableHead className='text-black font-semibold'>DESCRIPTION</TableHead>
                  <TableHead className='text-black font-semibold'>CATEGORY</TableHead>
                  <TableHead className='text-black font-semibold'>STATUS</TableHead>
                  <TableHead className='text-black font-semibold'>DATE ADDED</TableHead>
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-80" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : error ? (
            <p className='text-red-500'>Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>BRAND NAME</TableHead>
                  <TableHead className='text-black font-semibold'>DESCRIPTION</TableHead>
                  <TableHead className='text-black font-semibold'>CATEGORY</TableHead>
                  <TableHead className='text-black font-semibold'>STATUS</TableHead>
                  <TableHead className='text-black font-semibold'>DATE ADDED</TableHead>
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((brand, index) => (
                  <TableRow key={brand.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-semibold'>{brand.brandName}</TableCell>
                    <TableCell className='w-80'>{brand.description}</TableCell>
                    <TableCell>
                      <Badge variant={brand.category === "Pillows" ? "secondary" : "warning"}>
                        {brand.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={brand.status === 0 ? "success" : "error"}>
                        {brand.status === 0 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{brand.dateAdded}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(brand.id)}
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this brand? This action cannot be undone.
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
    </div>
  );
};

export default Brands;
