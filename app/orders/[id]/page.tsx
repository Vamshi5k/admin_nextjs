"use client";
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import axiosInstance from '@/app/Instance';

// Define interfaces for the order data
interface Product {
  productName: string;
  quantity: number;
  price: number;
}

interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  orderType: string;
}

interface DeliveryAddress {
  addressLine: string;
  buildingName?: string;
  streetNo?: string;
  postalCode: string;
}

interface Order {
  id: string;
  orderId: string;
  orderDate: string;
  orderTime: string;
  subTotal: number;
  deliveryFee: number;
  totalCost: number;
  status: number;
  products: Product[];
  customerDetails: CustomerDetails;
  deliveryAddress: DeliveryAddress;
  billingAddress: string;
}

const SingleOrder = ({params}: {params : any}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axiosInstance.get(`/neworders/${params?.id}`);
        setOrder(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch order data');
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [params.id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!order) return <p>No order found</p>;

  return (
    <div className="p-6">
      <div className="mb-8">
        <div>
          <span className='text-lg md:text-4xl font-semibold'>Order Number: </span>
          <span className='text-lg md:text-4xl font-extrabold text-red-600'>#{order?.orderId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        {/* Left Side Content */}
        <div className="space-y-8">
          <Card>
            <CardContent className='py-6'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-gray-800 font-bold text-base'>S.NO</TableHead>
                    <TableHead className='text-gray-800 font-bold text-base'>ITEMS SUMMARY</TableHead>
                    <TableHead className='text-gray-800 font-bold text-base'>QTY</TableHead>
                    <TableHead className='text-gray-800 font-bold text-base text-center'>PRICE</TableHead>
                    <TableHead className='text-gray-800 font-bold text-base text-end'>TOTAL PRICE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium text-sm'>{index + 1}</TableCell>
                      <TableCell className='font-medium text-sm'>{product?.productName}</TableCell>
                      <TableCell className='font-medium text-sm'>x {product?.quantity}</TableCell>
                      <TableCell className='font-medium text-sm text-center'>₹ {product?.price}</TableCell>
                      <TableCell className='font-bold text-sm text-end'>₹ {product?.price * product?.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className='font-bold text-sm'>Total</TableCell>
                    <TableCell className="text-right font-extrabold text-sm">₹ {order?.totalCost}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle className='text-lg'>Order Summary</CardTitle>
                <Badge
                  variant={
                    order?.status === 0 ? "warning" :
                      order?.status === 1 ? "violetLight" :
                        order?.status === 2 ? "secondary" :
                          order?.status === 3 ? "success" :
                            order?.status === 4 ? "lightOrange" :
                              order?.status === 5 ? "error" :
                                "default"
                  }
                  className='text-xs'
                >                  {order.status === 0 ? 'Pending' : order.status === 1 ? 'Processing' : order?.status === 2 ? "Shipping" : order?.status === 3 ? "Delivered" : order?.status === 4 ? "Return / Replacement" : order?.status === 5 ? "Cancelled" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='py-4'>
              <div className="grid gap-4">
                <ul className="grid gap-4">
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Order Created:</span>
                    <span className="text-gray-800 font-semibold">{order?.orderDate}</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Order Time:</span>
                    <span className="text-gray-800 font-semibold">{order?.orderTime}</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Sub Total:</span>
                    <span className="text-gray-800 font-semibold">₹ {order?.subTotal}</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Delivery Fee:</span>
                    <span className="text-gray-800 font-semibold">₹ {order?.deliveryFee}</span>
                  </li>
                  <Separator className="my-2" />
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Total:</span>
                    <span className="text-gray-800 font-semibold">₹ {order?.totalCost}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold mb-4'>Customer and Order Details</CardTitle>
              <Separator />
            </CardHeader>
            <CardContent className='py-4'>
              <div className="grid gap-4">
                <ul className="grid gap-4">
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Customer Name:</span>
                    <span className="text-gray-800 font-semibold">{order?.customerDetails?.name}</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Phone Number:</span>
                    <span className="text-gray-800 font-semibold">{order?.customerDetails?.phone}</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Email:</span>
                    <span className='text-gray-800 font-semibold'>{order?.customerDetails?.email}</span>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Order Type:</span>
                    <span className='text-gray-800 font-semibold'>{order?.customerDetails?.orderType}</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent className='py-4'>
              <ul className='grid gap-4'>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Address Line:</span>
                  <span className="text-gray-800">{order?.deliveryAddress?.addressLine}</span>
                </li>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Flat / Building Name:</span>
                  <span className="text-gray-800">{order?.deliveryAddress?.buildingName || 'N/A'}</span>
                </li>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Street No:</span>
                  <span className="text-gray-800">{order?.deliveryAddress?.streetNo || 'N/A'}</span>
                </li>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Postal Code:</span>
                  <span className="text-gray-800">{order?.deliveryAddress?.postalCode}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className='py-4'>
              <p className="text-gray-800">{order?.billingAddress}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
