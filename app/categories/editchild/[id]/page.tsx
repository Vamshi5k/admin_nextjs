"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    parentCategoryId: z.string().min(1, "Select Parent"),
    subcategoryid: z.string().min(1, "Select Sub Category")
});

interface ParentCategory {
    id: string;
    name: string;
}

interface SubCategory {
    id: string;
    subcategory: string;
    parentCategoryId: string;
    description?: string;
}

const EditChildCategory = () => {
    const [loading, setLoading] = useState(false);
    const [parentCategories, setParentCategories] = useState<ParentCategory[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const { toast } = useToast();
    const router = useRouter();
    const { id } = useParams<{ id: string }>();  // Ensure id is typed as string

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            parentCategoryId: "",
            subcategoryid: "",
        },
    });

    useEffect(() => {
        if (typeof id === 'string') {  // Ensure id is a string
            fetchSubCategory(id);
        }
        fetchParentCategories();
        fetchSubCategories();
    }, [id]);

    const handleError = (error: unknown, message: string) => {
        console.error(message, error);
        toast({
            title: "Error",
            description: message,
            variant: 'destructive'
        });
    };

    const fetchSubCategory = async (id: string) => {
        try {
            const { data } = await axiosInstance.get(`/childCategories/${id}`);
            setSubCategories([data]);
            form.reset(data);
        } catch (error) {
            handleError(error, "Error fetching subcategory details.");
        }
    };

    const fetchParentCategories = async () => {
        try {
            const { data } = await axiosInstance.get('/categories');
            setParentCategories(data);
        } catch (error) {
            handleError(error, "Error fetching parent categories.");
        }
    };

    const fetchSubCategories = async () => {
        try {
            const { data } = await axiosInstance.get('/subcategories');
            setSubCategories(data);
        } catch (error) {
            handleError(error, "Error fetching subcategories.");
        }
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            await axiosInstance.put(`/childCategories/${id}`, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            toast({
                title: "Success",
                description: "Sub category updated successfully!",
                variant: 'success'
            });
            router.push('/categories/child');
        } catch (error) {
            if (error instanceof AxiosError) {
                handleError(error, `Error submitting the form: ${error.response?.data?.error || error.message}`);
            } else {
                handleError(error, "Unexpected error.");
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
                        <h2 className="text-2xl font-bold tracking-tight">Edit Sub Category</h2>
                        <p className="text-gray-400 text-sm">
                            Fill the form and update the sub category details.
                        </p>
                        <Separator className="my-6" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="parentCategoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Parent Category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {parentCategories.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id}>
                                                                        {item.name}
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
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="subcategoryid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Sub Category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a subcategory" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {subCategories.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id}>
                                                                        {item.subcategory}
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
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Child Category Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Child Category Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter a description for the category"
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

export default EditChildCategory;
