"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

const AddCategory = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        try {
            await axiosInstance.post('/categories', data, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast({
                title: "Category Added",
                description: "Category added successfully!",
                variant: 'success'
            });
            router.push('/categories');
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
                            <h2 className="text-2xl font-bold tracking-tight">Add Category</h2>
                            <p className="text-gray-400 text-sm">
                                Fill the form and add the category to your list.
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
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Category Name"
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

export default AddCategory;
