"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useRouter } from "next/navigation";

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    // This Are The Form Validations
    const formSchema = z.object({
        productname: z.string().min(2, {
            message: "Product name must be at least 2 characters.",
        }),
        price: z
            .string()
            .regex(/^\d+(\.\d{1,2})?$/, "Price must be a positive number."),
        saleprice: z
            .string()
            .regex(/^\d+(\.\d{1,2})?$/, "Sale Price must be a positive number."),
        qty: z
            .string()
            .regex(/^\d+$/, "Quantity must be a positive integer."),
        type: z.string().min(1, "Type is required."),
        status: z.string().min(1, "Status is required."),
    });

    // This Are The Initial Values
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: "",
            productname: "",
            price: "",
            saleprice: "",
            qty: "",
            type: "Mattress",
            status: "0", 
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        const formattedData = {
            ...data,
            price: parseFloat(data.price),
            saleprice: parseFloat(data.saleprice),
            qty: parseInt(data.qty, 10),
        };

        try {
            await axiosInstance.post('/products', formattedData, {
                headers: { 'Content-Type': 'application/json' },
            });

            console.log(data);

            toast({
                title: "Product Added",
                description: "Product added successfully!",
                variant: 'success'
            });
            router.push('/products');
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Error submitting the form:", error.response?.data || error.message);
                toast({
                    title: "Submission Error",
                    description: `There was an error submitting the form: ${error.response?.data?.error || error.message}`,
                    variant: 'destructive'
                }, );
            } else {
                console.error("Unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <div className="space-y-6 p-5 pb-2">
                        <div className="space-y-0.5">
                            <h2 className="text-2xl font-bold tracking-tight">Add Product</h2>
                            <p className="text-gray-400 text-sm">
                                Fill the form and add the product to your list.
                            </p>
                        </div>
                        <Separator className="my-6" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Column 0 */}
                                {/* Uncomment if image upload is needed */}
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Image</FormLabel>
                                                <FormControl>
                                                    <Input id="picture" type="file" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Column 1 */}
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="productname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Product Name (e.g., Premium Pillow)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Product Price (e.g., 99.99)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Column 2 */}
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="saleprice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sale Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Product Sale Price (e.g., 89.99)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="qty"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Product Quantity (e.g., 10)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Column 3 */}
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        defaultValue={field.value || "Mattress"}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Select Type</SelectLabel>
                                                                <SelectItem value="Mattress">Mattress</SelectItem>
                                                                <SelectItem value="Pillow">Pillow</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Column 4 */}
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        defaultValue={field.value || "0"}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Select Status</SelectLabel>
                                                                <SelectItem value="0">In Stock</SelectItem>
                                                                <SelectItem value="1">Out Of Stock</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="text-end">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Submitting..." : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddProduct;
