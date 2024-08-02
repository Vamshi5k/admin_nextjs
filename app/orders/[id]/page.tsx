"use client";
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface Params {
  id: string;
}

const SingleOrder = ({ params }: { params: Params }) => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <span className='text-lg md:text-4xl font-semibold'>Order Number: </span>
        <span className='text-lg md:text-4xl font-extrabold text-red-600'>#{params.id}</span>
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
                  <TableRow>
                    <TableCell className='font-medium text-sm'>1</TableCell>
                    <TableCell className='font-medium text-sm'>Foam Mattress</TableCell>
                    <TableCell className='font-medium text-sm'>x 1</TableCell>
                    <TableCell className='font-medium text-sm text-center'>₹ 15,000</TableCell>
                    <TableCell className='font-bold text-sm text-end'>₹ 15,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium text-sm'>2</TableCell>
                    <TableCell className='font-medium text-sm'>Foam Mattress</TableCell>
                    <TableCell className='font-medium text-sm'>x 1</TableCell>
                    <TableCell className='font-medium text-sm text-center'>₹ 15,000</TableCell>
                    <TableCell className='font-bold text-sm text-end'>₹ 15,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium text-sm'>3</TableCell>
                    <TableCell className='font-medium text-sm'>Foam Mattress</TableCell>
                    <TableCell className='font-medium text-sm'>x 1</TableCell>
                    <TableCell className='font-medium text-sm text-center'>₹ 15,000</TableCell>
                    <TableCell className='font-bold text-sm text-end'>₹ 15,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className='font-medium text-sm'>4</TableCell>
                    <TableCell className='font-medium text-sm'>Foam Mattress</TableCell>
                    <TableCell className='font-medium text-sm'>x 1</TableCell>
                    <TableCell className='font-medium text-sm text-center'>₹ 15,000</TableCell>
                    <TableCell className='font-bold text-sm text-end'>₹ 15,000</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className='font-bold text-sm'>Total</TableCell>
                    <TableCell className="text-right font-extrabold text-sm">₹ 60,000</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <CardTitle className='text-lg'>Order Summary</CardTitle>
                <Badge variant={"success"} className='text-xs'>Out For Delivery</Badge>
              </div>
            </CardHeader>
            <CardContent className='py-4'>
              <div className="grid gap-4">
                <ul className="grid gap-4">
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Order Created:</span>
                    <span className="text-gray-800 font-semibold">Thurs, Sep 2, 2024</span>
                  </li>
                  <Separator className="my-2" />
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Order Time:</span>
                    <span className="text-gray-800 font-semibold">12:07 PM</span>
                  </li>
                  <Separator className="my-2" />
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Sub Total:</span>
                    <span className="text-gray-800 font-semibold">₹ 60,000</span>
                  </li>
                  <Separator className="my-2" />
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Delivery Fee:</span>
                    <span className="text-gray-800 font-semibold">₹ 325</span>
                  </li>
                  <Separator className="my-2" />
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Total:</span>
                    <span className="text-gray-800 font-semibold">₹ 60,325</span>
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
                    <span className="text-gray-800 font-semibold">Vamshi Animela</span>
                  </li>
                  {/* <Separator className="my-2" /> */}
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Phone Number:</span>
                    <span className="text-gray-800 font-semibold">+91 7995541707</span>
                  </li>
                  {/* <Separator className="my-2" /> */}
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Email:</span>
                    <span className='text-gray-800 font-semibold'>Vamshianimela@spackdigi.com</span>
                  </li>
                  {/* <Separator className="my-2" /> */}
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-800 font-semibold">Order Type:</span>
                    <span className='text-gray-800 font-semibold'>Cash On Delivery</span>
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
                  <span className="text-gray-800">14 Angray Road</span>
                </li>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Flat / Building Name:</span>
                  <span className="text-gray-800">Varuna Towers</span>
                </li>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Street No:</span>
                  <span className="text-gray-800">21</span>
                </li>
                <li className='flex items-center justify-between text-sm'>
                  <span className="text-gray-800">Postal Code:</span>
                  <span className="text-gray-800">52145</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl font-bold'>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className='py-4'>
              <span className="text-gray-800">Same As Shipping Address</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
