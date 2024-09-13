"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Plus, Trash } from 'lucide-react';
import axiosInstance from '@/app/Instance';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface Plan {
  value: string;
  label: string;
}

interface Freelancer {
  id: string;
  freelancername: string;
  username: string;
  phone: string;
  email: string;
  plans: Plan[];
  status: number;
  dor: string; 
}

const Freelancer: React.FC = () => {
  const { toast } = useToast();
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [itemsPerPage] = useState<number>(7);

  const fetchFreelancers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/freelancers');
      if (res?.data) {
        setFreelancers(res.data);
      }
    } catch (error) {
      setError('Error Fetching The Freelancer Data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (id: any) => {
    setSelectedFreelancerId(id);
  };

  const handleDeleteCancel = () => {
    setSelectedFreelancerId(null);
  };

  const confirmDeleteHandler = async () => {
    if (selectedFreelancerId) {
      try {
        await axiosInstance.delete(`/freelancers/${selectedFreelancerId}`);
        setFreelancers(prev => prev.filter(f => f.id !== selectedFreelancerId));
        toast({
          variant: "default",
          title: "Success!",
          description: "Freelancer deleted successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error deleting the freelancer.",
        });
      } finally {
        setSelectedFreelancerId(null);
      }
    }
  };

  const totalPages = Math.ceil(freelancers.length / itemsPerPage);
  const currentFreelancers = freelancers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <Card className="w-[98%]">
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Freelancers</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {freelancers.length}  Freelancer&apos;s</CardDescription>
            </div>
            <div>
              <Link href='/vendors/freelancers/add'>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Freelancer
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {Array.from({ length: itemsPerPage }).map((_, idx) => (
                    <TableHead key={idx} className='text-black font-semibold'>
                      <Skeleton className='w-24 h-6' />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <TableRow key={idx}>
                    {['', '', '', '', '', '', ''].map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className='w-24 h-6' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>FREELANCER NAME</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>USER NAME</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>PHONE</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>EMAIL</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>STATUS</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>PLAN</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold text-end'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFreelancers.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{(currentPage - 1) * itemsPerPage + currentFreelancers.indexOf(item) + 1}</TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item.freelancername}</TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item.username}</TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item.phone}</TableCell>
                    <TableCell className='font-semibold text-heading-dark dark:text-neutral-400'>{item.email}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 0 ? 'success' : item.status === 1 ? 'error' : item.status === 3 ? 'pending' : 'default'}>
                        {item.status === 0 ? "Active" : item.status === 1 ? "Inactive" : item.status === 3 ? "Pending" : "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-end'>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="default" onClick={() => setOpenModal(item.id)}>
                            View Plans
                          </Button>
                        </DialogTrigger>
                        {openModal === item.id && (
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Plans for {item.freelancername}</DialogTitle>
                              <DialogDescription>
                                {item.plans.length} Plans
                              </DialogDescription>
                            </DialogHeader>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>PLAN</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {item.plans.map((plan : Plan, index) => (
                                  <TableRow key={index}>
                                    <TableCell className='font-semibold'>{index + 1}</TableCell>
                                    <TableCell className='font-semibold'>{plan.label}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <DialogFooter>
                              <Button onClick={() => setOpenModal(null)}>Close</Button>
                            </DialogFooter>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                    <TableCell className='text-end'>
                      <Link href={`/vendors/freelancers/edit/${item?.id}`}>
                        <Button variant="outline" size="icon" className='me-3'>
                          <Pencil className='h-4 w-4' />
                        </Button>
                      </Link>
                      <AlertDialog open={!!selectedFreelancerId} onOpenChange={(open) => {
                        if (!open) handleDeleteCancel();
                      }}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteClick(item.id)}
                            className='me-3'
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will delete the freelancer and it cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteHandler}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Link href={`/freelancers/view/${item.id}`}>
                        <Button variant="outline" size="icon" className='me-3'>
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
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
              <PaginationPrevious onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1)
              }}
                aria-label="Previous Page"
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
                  if (currentPage < totalPages) handlePageChange(currentPage + 1)
                }}
                aria-label="Next Page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default Freelancer;
