'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axiosInstance from '../Instance';
import { Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import ErrorImage from "../../img/error.svg";
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: number;
  dateOfRegistration: string;
  profilePic: string;
  isActive: number;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggledUsers, setToggledUsers] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/userslist');
        if (response) {
          setUsers(response?.data);
        } else {
          notFound();
        }
      } catch (error) {
        setError('Error fetching users data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filterUsers = users.filter((user) => {
    const name = user.name?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const mobile = user.phone || '';

    return (
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      mobile.includes(searchQuery)
    );
  });

  const totalPages = Math.ceil(filterUsers.length / itemsPerPage);
  const currentUserList = filterUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggle = (id: number) => {
    setToggledUsers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const HandleSwitchChange = async (id: any) => {
    try {
      const user = users.find((item) => item?.id === id);
      if (user) {
        const updatedUser = { ...user, isActive: user.isActive === 1 ? 0 : 1 };
        // const res = await axiosInstance.put(`/userlist/${id}`, updatedUser);

        // console.log(res);
        setUsers((prevUsers) =>
          prevUsers.map((item) => (item.id === id ? updatedUser : item))
        );
      }
    } catch (error) {
      console.log(error);
      toast({
        description: "Error Updating Status Of User",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Users</CardTitle>
              <CardDescription>Overall {users.length} New Users</CardDescription>
            </div>
            <div>
              <Input
                type="search"
                placeholder="Search Users...."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96 appearance-none bg-background pl-4 shadow-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>NAME</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>EMAIL</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>MOBILE</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>DATE OF JOINING</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>STATUS SWITCH</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-6 w-10" /></TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className='space-y-2'>
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : filterUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <Image src={ErrorImage} alt="No Users Found" className="mb-4 w-60 h-60" />
              <p className="text-heading-dark dark:text-[#FACC15] font-bold">No users found matching your search criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>S.NO</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>NAME</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>EMAIL</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>MOBILE</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>STATUS</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>DOR</TableHead>
                  <TableHead className='text-heading-dark dark:text-[#FACC15] font-bold'>SWITCH STATUS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUserList.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                    <TableCell className='font-semibold'>
                      <Link href={`/userslist/singleuser/${user.id}`}>
                        <div className='flex items-center gap-2'>
                          <Avatar>
                            {user.profilePic ? (
                              <AvatarImage src={user.profilePic} width={40} className='rounded-lg' />
                            ) : (
                              <AvatarFallback className='flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-lg text-lg'>
                                {user.name[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          {user?.name}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className='text-heading-dark dark:text-'>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive === 0 ? "success" : "error"}>
                        {user.isActive === 0 ? "Active" : "Blocked"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.dateOfRegistration}</TableCell>
                    <TableCell>
                      <Switch checked={user.isActive === 1} onCheckedChange={() => HandleSwitchChange(user?.id)} />
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
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
                aria-label="Next Page"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default UserList;
