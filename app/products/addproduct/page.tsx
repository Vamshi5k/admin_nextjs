"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormInputs {
    id: string;
    productname: string;
    price: string;
    saleprice: string;
    qty: string;
    type: string;
    status: string;
    category: string;
    subcategory: string;
    description?: string;
    brands: string;
    image: any,
}

const AddProduct: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subCategory, setSubCategory] = useState<any[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    const formSchema = z.object({
        productname: z.string().min(2, {
            message: "Product name must be at least 2 characters.",
        }),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be a positive number."),
        saleprice: z.string().regex(/^\d+(\.\d{1,2})?$/, "Sale Price must be a positive number."),
        qty: z.string().regex(/^\d+$/, "Quantity must be a positive integer."),
        type: z.string().min(1, "Type is required."),
        status: z.string().min(1, "Status is required."),
        category: z.string().min(1, "Category is required."),
        subcategory: z.string().min(1, "Sub Category is required."),
        brands: z.string().min(1, "Brand is required."),
        description: z.string().optional(),
    });

    const form = useForm<ProductFormInputs>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productname: "",
            price: "",
            saleprice: "",
            description: "",
            qty: "",
            type: "Mattress",
            status: "0",
            category: "",
            subcategory: "",
            brands: "",
            image: null,
        },
    });

    const GetBrands = async () => {
        try {
            const res = await axiosInstance.get('/brands');
            setBrands(res?.data);
        } catch (error) {
            console.error("Error Fetching Brands", error);
        }
    }

    const GetCategories = async () => {
        try {
            const res = await axiosInstance.get('/categories');
            setCategories(res?.data);
        } catch (error) {
            console.error("Error Fetching Categories", error);
        }
    }

    const GetSubCategories = async () => {
        try {
            const res = await axiosInstance.get('/subcategories');
            setSubCategory(res?.data);
        } catch (error) {
            console.error("Error Fetching Sub Categories", error);
        }
    }

    useEffect(() => {
        GetBrands();
        GetCategories();
        GetSubCategories();
    }, []);

    const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
        setLoading(true);

        try {
            // Log form data to console
            console.log("Form data:", data);

            await axiosInstance.post('/products', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            toast({
                title: "Product Added",
                description: "Product added successfully!",
                variant: 'success'
            });

            router.push('/products');
        } catch (error) {
            if (error instanceof AxiosError) {
                toast({
                    title: "Submission Error",
                    description: `There was an error submitting the form: ${error.response?.data?.error || error.message}`,
                    variant: 'destructive'
                });
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
                <CardContent className="px-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Column 0 */}
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
                                        name="brands"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Brand" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {brands?.map((item: { id: string, brandName: string }) => (
                                                                    <SelectItem key={item?.id} value={item?.id}>
                                                                        {item?.brandName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {categories?.map((item: any) => (
                                                                    <SelectItem key={item?.id} value={item?.id}>{item?.name}</SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="subcategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sub Category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value || ''}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Sub Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {subCategory?.map((item: any) => (
                                                                    <SelectItem key={item?.id} value={item?.id}>
                                                                        {item?.subcategory}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Image</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        accept="image/*"
                                                        type="file"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your product description"
                                                        {...field}
                                                        rows={5}
                                                        className="w-full"
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
                                                        type="number"
                                                        placeholder="Enter Product Quantity (e.g., 10)"
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
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
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

                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
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
