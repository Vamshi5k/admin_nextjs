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
    subcategory: z.string().min(1, "Sub Category is required"),
    description: z.string().optional(),
    parentCategoryId: z.string().min(1, "Select Parent")
});

interface ParentCategory {
    id: any;
    name: string;
}

interface SubCategory {
    id: any;
    subcategory: string;
    parentCategoryId: string;
    description?: string;
}

const EditSubCategory = () => {
    const [loading, setLoading] = useState(false);
    const [parentCategory, setParentCategory] = useState<ParentCategory[]>([]);
    const [subcategory, setSubCategory] = useState<SubCategory | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const { id } = useParams();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subcategory: "",
            description: "",
            parentCategoryId: ""
        },
    });
    useEffect(() => {
        if (id && typeof id === 'string') {
            getSubCategory(id);
        }
    }, [id]);

    const getSubCategory = async (id: string) => {
        try {
            const res = await axiosInstance.get(`/subcategories/${id}`);
            setSubCategory(res.data);
            form.reset({
                subcategory: res.data.subcategory,
                parentCategoryId: res.data.parentCategoryId,
                description: res.data.description,
            });
        } catch (error) {
            console.error("Error fetching subcategory:", error);
            toast({
                title: "Fetch Error",
                description: "There was an error fetching the subcategory details.",
                variant: 'destructive',
            });
        }
    }

    const fetchParent = async () => {
        try {
            const res = await axiosInstance.get('/categories');
            if (res.data) {
                setParentCategory(res.data);
            }
        } catch (error) {
            console.error("Error Fetching the Parent");
            toast({
                title: "Submission Error",
                description: "Error Fetching The Parent",
                variant: 'destructive'
            });
        }
    };

    useEffect(() => {
        fetchParent();
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            await axiosInstance.put(`/subcategories/${id}`, data, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast({
                title: "Sub Category Updated",
                description: "Sub Category Updated successfully!",
                variant: 'success'
            });
            router.push('/categories/sub');
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
                            <h2 className="text-2xl font-bold tracking-tight">Edit Sub Category</h2>
                            <p className="text-gray-400 text-sm">
                                Fill the form and update the sub category details.
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
                                        name="subcategory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sub Category Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Sub Category Name"
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

export default EditSubCategory;
