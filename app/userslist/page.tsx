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

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: number;
  dateOfJoining: string;
  profilePic: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toggledUsers, setToggledUsers] = useState<Record<number, boolean>>({});

  const ToggleHandler = (id: number) => {
    setToggledUsers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/userslist');
      if (response?.data) {
        setUsers(response.data);
      }
    } catch (error) {
      setError("Error fetching users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Users</CardTitle>
              <CardDescription>Overall {users.length} New Users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>NAME</TableHead>
                  <TableHead className='text-black font-semibold'>EMAIL</TableHead>
                  <TableHead className='text-black font-semibold'>MOBILE</TableHead>
                  <TableHead className='text-black font-semibold'>STATUS</TableHead>
                  <TableHead className='text-black font-semibold'>DATE OF JOINING</TableHead>
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(10)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-10" />
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className='space-y-2'>
                          <Skeleton className="h-6 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>NAME</TableHead>
                  <TableHead className='text-black font-semibold'>EMAIL</TableHead>
                  <TableHead className='text-black font-semibold'>MOBILE</TableHead>
                  <TableHead className='text-black font-semibold'>STATUS</TableHead>
                  <TableHead className='text-black font-semibold'>DATE OF JOINING</TableHead>
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-semibold'>
                      <div className='flex items-center gap-2'>
                        <Avatar>
                          {item.profilePic ? (
                            <AvatarImage src={item.profilePic} width={40} className='rounded-lg' />
                          ) : (
                            <AvatarFallback className='flex items-center justify-center w-10 h-10 bg-gray-200 text-gray-700 rounded-lg text-lg'>
                              {item.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.mobile}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 0 ? "success" : "error"}>
                        {item.status === 0 ? "Active" : "Blocked"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.dateOfJoining}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => ToggleHandler(item.id)}
                      >
                        {toggledUsers[item.id] ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
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

export default UserList;
