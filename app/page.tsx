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
import axios from "axios";

export default function Home() {
  const [orders, setOrders] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const GetOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
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

  useEffect(() => {
    GetOrders();
  }, []);

  return (
    <main>
      {/* CARDS SECTION STARTS HERE */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-10">
        <DashboardCard title={"New Orders"} Icon={<ShoppingCart size={20} aria-label="New Orders" />} number={200} description={"You have new orders today."} />
        <DashboardCard title={"Completed Orders"} Icon={<Car size={20} aria-label="Completed Orders" />} number={125} description={"Completed Orders Today."} />
        <DashboardCard title={"Total Revenue"} Icon={<Coins size={20} aria-label="Total Revenue" />} number={"25,000"} description={"+20.1% from last month"} />
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
              <Overview />
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
              <RecentSales />
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
              <p className="text-lg md:text-2xl font-semibold">Loading recent orders...</p>
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
                      <TableCell>{order?.orderNumber}</TableCell>
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
