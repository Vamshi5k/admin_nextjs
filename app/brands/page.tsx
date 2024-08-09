"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axiosInstance from '../Instance';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash } from 'lucide-react';
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
import Image from 'next/image';

interface Brand {
  id: string;
  brandName: string;
  description: string;
  logo: string;
}

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
        setSelectedBrandId(null);
      }
    }
  };

  const handleDeleteCancel = () => {
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
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-80" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>LOGO</TableHead>
                  <TableHead className='text-black font-semibold'>BRAND NAME</TableHead>
                  <TableHead className='text-black font-semibold'>DESCRIPTION</TableHead>
                  <TableHead className='text-black font-semibold text-end'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Image src={item.logo} width={40} height={20} alt='brand_logo' className='rounded-full' />
                    </TableCell>
                    <TableCell className='font-semibold'>{item.brandName}</TableCell>
                    <TableCell className='w-80'>{item.description}</TableCell>
                    <TableCell className='text-end'>
                      <Link href={`/brands/editbrand/${item.id}`}>
                        <Button variant="outline" size="icon" className='me-3'>
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </Link>
                      <AlertDialog open={!!selectedBrandId} onOpenChange={() => setSelectedBrandId(null)}>
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
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will delete the brand and it cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
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
