"use client";
import axiosInstance from '@/app/Instance';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import Welcome from "../../../../img/hey.svg";
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table, TableHead, TableRow, TableHeader, TableCell, TableBody
} from "@/components/ui/table";
import Human from "../../../../img/human.png";

// Define interfaces for types
interface Address {
  houseNo: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
}

interface OrderedAmount {
  completedOrders: number;
  pending: number;
}

interface AdditionalInfo {
  dob: string;
  phone: string;
  address: Address;
  orderedAmount: OrderedAmount;
  userId: string;
  emailVerify: string;
  registerAt: string;
}

interface RecentOrder {
  sNo: number;
  orderId: string;
  noOfProducts: number;
  amount: number;
  status: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: number;
  dateOfJoining: string;
  profilePic: string;
  additionalInfo: AdditionalInfo;
  recentOrders: RecentOrder[];
}

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get(`/singleUser/${id}`);
          setUser(response?.data);
        } catch (error) {
          setError('Error fetching user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No User Data</div>;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="flex flex-row justify-between items-start">
                  <div className="flex flex-col gap-y-2">
                    <CardTitle>Hey {user.name} !!</CardTitle>
                    <CardDescription className="max-w-lg text-balance leading-relaxed">
                      Your Orders Data Analysis
                    </CardDescription>
                  </div>
                  <div>
                    <Image src={Welcome} alt='Image' width={100} />
                  </div>
                </CardHeader>
              </Card>

              {/* This Month Orders */}
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>This Month Orders</CardDescription>
                  <CardTitle className="flex items-center">
                    <span className='text-4xl'>{user.recentOrders.length}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +40% from last month
                  </div>
                </CardContent>
              </Card>

              {/* Total Amount Transacted */}
              <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>Total Amount Transacted</CardDescription>
                  <CardTitle className="text-4xl">
                    ₹ {user.recentOrders.reduce((acc, order) => acc + order.amount, 0)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +20% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Orders Table */}
            <div>
              <Card className='mt-5'>
                <CardHeader className="px-7">
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>
                    Recent orders from your store.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.NO</TableHead>
                        <TableHead className="hidden sm:table-cell">ORDER ID</TableHead>
                        <TableHead className="hidden md:table-cell">NO OF PRODUCTS</TableHead>
                        <TableHead className="text-right">AMOUNT</TableHead>
                        <TableHead className="text-right">STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.recentOrders.map(order => (
                        <TableRow key={order.orderId}>
                          <TableCell className='text-medium'>{order.sNo}</TableCell>
                          <TableCell className="hidden sm:table-cell">{order.orderId}</TableCell>
                          <TableCell>
                            <Badge variant={"outline"}>{order.noOfProducts}</Badge>
                          </TableCell>
                          <TableCell className="text-right">₹ {order.amount}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant={order.status === 0 ? "warning" : "success"}>
                              {order.status === 0 ? "Pending" : "Completed"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* User Profile Information */}
          <div>
            <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
              <div className="border-b border-muted">
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="mx-auto px-3 py-3 bg-black rounded-full">
                      <Image src={Human} alt='User_Image' width={70} height={50} />
                    </div>
                    <div className='flex flex-col justify-center items-center gap-y-3'>
                      <Badge variant={"outline"}> User</Badge>
                      <h1 className='text-xl md:text-3xl font-semibold'>{user.name}</h1>
                      <h5 className='font-medium'>{user.email}</h5>
                    </div>
                    <dl className="grid gap-3 mt-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">DOB</dt>
                        <dd>{user.additionalInfo.dob}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Phone</dt>
                        <dd><a href={`tel:${user.additionalInfo.phone}`}>{user.additionalInfo.phone}</a></dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </div>

              <div className="border-b border-muted">
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Address</div>
                    <dl className="grid gap-3 mt-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">House No :</dt>
                        <dd className='text-black font-bold'>{user.additionalInfo.address.houseNo}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Area</dt>
                        <dd className='text-black font-bold'>{user.additionalInfo.address.area}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">City</dt>
                        <dd className='text-black font-bold'>{user.additionalInfo.address.city}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">State</dt>
                        <dd className='text-black font-bold'>{user.additionalInfo.address.state}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Pincode</dt>
                        <dd className='text-black font-bold'>{user.additionalInfo.address.pincode}</dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </div>

              <div className="border-b border-muted">
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Ordered Amount</div>
                    <dl className="grid gap-3 mt-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Completed Orders</dt>
                        <dd className='text-black font-bold'>₹ {user.additionalInfo.orderedAmount.completedOrders}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Pending</dt>
                        <dd className='text-black font-bold'>₹ {user.additionalInfo.orderedAmount.pending}</dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </div>

              <div className="border-b border-muted">
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">Additional Information</div>
                    <dl className="grid gap-3 mt-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">User Id:</dt>
                        <dd className='text-black'>{user.additionalInfo.userId}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Email Verify:</dt>
                        <dd className={`text-${user?.additionalInfo?.emailVerify === 'Verified' ? 'green-500' : 'red-500'} font-bold`}>
                          {user.additionalInfo.emailVerify}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Register At:</dt>
                        <dd className='text-black'>{user.additionalInfo.registerAt}</dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SingleUser;
