"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// Define TypeScript interfaces for API responses
interface ParentCategory {
    id: string;
    name: string;
}

interface SubCategory {
    id: string;
    subcategory: string;
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    parentCategoryId: z.string().min(1, "Select Parent"),
    subcategoryid: z.string().min(1, "Select Sub Category")
});

const AddChildCategory = () => {
    const [loading, setLoading] = useState(false);
    const [parentCategory, setParentCategory] = useState<ParentCategory[]>([]);
    const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            parentCategoryId: "",
            subcategoryid: "",
        },
    });

    const fetchParent = async () => {
        try {
            const res = await axiosInstance.get<ParentCategory[]>('/categories');
            if (res.data) {
                setParentCategory(res.data);
            }
        } catch (error) {
            console.error("Error Fetching Parent Categories", error);
            toast({
                title: "Error Fetching Parent Categories",
                description: "Unable to fetch parent categories.",
                variant: 'destructive'
            });
        }
    };

    const fetchSubCategories = async () => {
        try {
            const res = await axiosInstance.get<SubCategory[]>('/subcategories');
            if (res.data) {
                console.log(res?.data);
                setSubCategory(res.data);
            }
        } catch (error) {
            console.error("Error Fetching Sub Categories", error);
            toast({
                title: "Error Fetching Sub Categories",
                description: "Unable to fetch subcategories.",
                variant: 'destructive'
            });
        }
    };

    useEffect(() => {
        fetchParent();
        fetchSubCategories();
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            await axiosInstance.post('/childCategories', data, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(data);
            toast({
                title: "Sub Category Added",
                description: "Sub category added successfully!",
                variant: 'success'
            });
            router.push('/categories/child');
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Error submitting the form:", error.response?.data || error.message);
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
                            <h2 className="text-2xl font-bold tracking-tight">Add Child Category</h2>
                            <p className="text-gray-400 text-sm">
                                Fill the form and add the child category to your list.
                            </p>
                        </div>
                        <Separator className="my-6" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="parentCategoryId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Parent Category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        defaultValue=""
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {parentCategory.map((item) => (
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
                                <div className="col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="subcategoryid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Select Sub Category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                        defaultValue=""
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a subcategory" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                {subCategory.map((item) => (
                                                                    <SelectItem key={item.id} value={item.id}>
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
                                <div className="col-span-1">
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
                                <div className="col-span-1">
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

export default AddChildCategory;
