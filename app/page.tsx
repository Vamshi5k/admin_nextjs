"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Overview } from "./components/dashboard/overview";
import { RecentSales } from "./components/dashboard/recentsales";
import DashboardCard from "./components/dashboard/Card/DashboardCard";
import { Car, Coins, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axiosInstance from "./Instance";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [orders, setOrders] = useState<any>([]);
  const [newOrders, setNewOrders] = useState<any>([]);
  const [completedOrders, setCompletedOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const GetOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders');
      if (!response.data) {
        throw new Error('Error Fetching Orders');
      }
      setOrders(response.data);
    } catch (error) {
      setError("Error Fetching Orders");
    } finally {
      setLoading(false);
    }
  };

  const GetNewOrders = async () => {
    try {
      const response = await axiosInstance.get('/neworders');
      if (!response.data) {
        throw new Error('Error Fetching Orders');
      }
      setNewOrders(response.data);
      const completed = response?.data.filter((item: any) => item?.status === 3);
      setCompletedOrders(completed);
    } catch (error) {
      setError("Error Fetching Orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    GetOrders();
    GetNewOrders();
  }, []);

  return (
    <main>
      {/* CARDS SECTION STARTS HERE */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        {loading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : (
          <>
            <DashboardCard
              title={"New Orders"}
              Icon={<ShoppingCart size={20} aria-label="New Orders" />}
              number={newOrders?.length}
              description={"You have new orders today."}
              loading={loading}
            />
            <DashboardCard
              title={"Completed Orders"}
              Icon={<Car size={20} aria-label="Completed Orders" />}
              number={completedOrders?.length}
              description={"Completed Orders Today."}
              loading={loading}
            />
            <DashboardCard
              title={"Total Revenue"}
              Icon={<Coins size={20} aria-label="Total Revenue" />}
              number={"25,000"}
              description={"+20.1% from last month"}
              loading={loading}
            />
          </>
        )}
      </div>
      {/* CARDS SECTION ENDS HERE */}

      {/* OVERVIEW AND TRANSACTION SECTIONS STARTS HERE */}
      <div className="mt-10 mb-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {loading ? <Skeleton className="h-96 w-full" /> : <Overview />}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest Top 5 Transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-96 w-full" /> : <RecentSales />}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* OVERVIEW AND TRANSACTION SECTIONS ENDS HERE */}

      {/* RECENT ORDERS TABLE STARTS HERE */}
      <div className="mt-10 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-2xl font-semibold">Recent Orders</CardTitle>
            <CardDescription>Latest 5 Orders</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-semibold">S.NO</TableHead>
                    <TableHead className="text-black font-semibold">ORDER NUMBER</TableHead>
                    <TableHead className="text-black font-semibold">NO. OF PRODUCTS</TableHead>
                    <TableHead className="text-black font-semibold">AMOUNT</TableHead>
                    <TableHead className="text-black font-semibold text-end">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.slice(-5)?.map((order: any, index: number) => (
                    <TableRow key={order?.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-bold">{order?.orderNumber}</TableCell>
                      <TableCell>{order?.productCount}</TableCell>
                      <TableCell>{order?.amount}</TableCell>
                      <TableCell className="text-end">
                        <Badge variant={order?.status === 'Completed' ? 'success' : order?.status === 'Pending' ? 'warning' : 'error'}>
                          {order?.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      {/* RECENT ORDERS TABLE ENDS HERE */}
    </main>
  );
}
