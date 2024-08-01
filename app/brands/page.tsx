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

interface Brands {
  id: any;
  brandName: string;
  description: string;
  category: string;
  logo?: string;
  status: number;
  dateAdded: string;
}

const Brands = () => {
  const [brands, setBrands] = useState<Brands[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedBrandId, setSelectedBrandId] = useState<any>(null);
  const { toast } = useToast();

  const GetBrands = async () => {
    setLoading(true); 
    try {
      const res = await axiosInstance.get('/brands');
      if (res?.data) {
        setBrands(res?.data);
      }
    } catch (error) {
      console.log("Error fetching brands");
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
    GetBrands();
  }, []);

  const handleDeleteClick = (id: any) => {
    setSelectedBrandId(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedBrandId !== null) {
      try {
        await axiosInstance.delete(`/brands/${selectedBrandId}`);
        setBrands(brands.filter((brand) => brand?.id !== selectedBrandId));
        toast({
          description: 'Brand deleted successfully',
          variant: 'success',
        });
      } catch (error) {
        console.log('Error deleting the brand');
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
            <p className='text-lg md:text-2xl font-semibold'>Loading Brands....</p>
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
                {brands.map((item: Brands, index: number) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-semibold'>{item?.brandName}</TableCell>
                    <TableCell className='w-80'>{item?.description}</TableCell>
                    <TableCell>
                      <Badge variant={item?.category === "Pillows" ? "secondary" : "warning"}>
                        {item?.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item?.status === 0 ? "success" : "error"}>
                        {item?.status === 0 ? "Active" : "In Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item?.dateAdded}</TableCell>
                    <TableCell>
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
