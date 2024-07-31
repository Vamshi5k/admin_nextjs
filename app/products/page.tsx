"use client";
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Pencil, Plus, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import Link from 'next/link';

const Products = () => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)


  const GetProducts = async () => {
    try {
      const res = await axios.get(`/api/products`)
      if (res?.data) {
        setProducts(res?.data)
      }
    } catch (error) {
      console.log("Error Fetching The Products Data")
    }
  }

  useEffect(() => {
    GetProducts()
  }, [])

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='w-full h-auto flex justify-between items-center'>
            <div>
              <CardTitle className="text-lg md:text-2xl font-semibold">Products</CardTitle>
              <CardDescription className='text-xs mt-1'>Overall {products.length} New Products</CardDescription>
            </div>
            <div>
              <Link href={'/products/addproduct'}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Product
                </Button>
              </Link>

            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-lg md:text-xl font-semibold">Loading users...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-black font-semibold'>S.NO</TableHead>
                  <TableHead className='text-black font-semibold'>PRODUCT</TableHead>
                  <TableHead className='text-black font-semibold'>PRICE</TableHead>
                  <TableHead className='text-black font-semibold'>SALE PRICE</TableHead>
                  <TableHead className='text-black font-semibold'>QTY</TableHead>
                  <TableHead className='text-black font-semibold'>TYPE</TableHead>
                  <TableHead className='text-black font-semibold'>STATUS</TableHead>
                  <TableHead className='text-black font-semibold'>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((item: any, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className='font-semibold'>
                        <div className='flex items-center gap-2'>
                          <Avatar>

                            <AvatarImage src={item?.image} width={40} className='rounded-lg' />

                          </Avatar>
                          {item?.name}
                        </div>

                      </TableCell>
                      <TableCell>₹ {item?.price}</TableCell>
                      <TableCell>₹ {item?.salePrice}</TableCell>
                      <TableCell>
                        <Badge variant={"outline"}>
                          {item?.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item?.type === "Mattress" ? "success" : "warning"}>{item?.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item?.status === 0 ? "secondary" : "error"}>{item?.status === 0 ? "In Stock" : item?.status === 1 ? "Out Of Stock" : ""}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className='me-3'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                        >
                          <Trash className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}

              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Products