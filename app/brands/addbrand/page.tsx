"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

const AddBrand = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const formSchema = z.object({
        brandName: z.string().min(2, { message: "Brand name must be at least 2 characters." }),
        category: z.string().min(1, "Category is required."),
        status: z.string().min(1, "Status is required."),
        description: z.string().optional(),
        dateAdded: z.date().optional()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            brandName: "",
            category: "Mattress",
            status: "0",
            description: "",
            dateAdded: new Date(),
        },
    });

    const { setValue, handleSubmit, watch, control } = form;
    const dateAdded = watch("dateAdded");

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);

        const formattedData = {
            ...data,
            dateAdded: data.dateAdded ? format(data.dateAdded, "yyyy-MM-dd") : "",
        };

        try {
            await axiosInstance.post('/brands', formattedData, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast({
                title: "Brand Added",
                description: "Brand added successfully!",
                variant: 'success',
            });
            router.push('/brands');
            console.log(formattedData);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Error submitting the form:", error.response?.data || error.message);
                toast({
                    title: "Submission Error",
                    description: `There was an error submitting the form: ${error.response?.data?.error || error.message}`,
                    variant: 'destructive',
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
                            <h2 className="text-2xl font-bold tracking-tight">Add Brand</h2>
                            <p className="text-gray-400 text-sm">
                                Fill the form and add the Brand to your list.
                            </p>
                        </div>
                        <Separator className="my-6" />
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Brand Name */}
                                <div>
                                    <FormField
                                        control={control}
                                        name="brandName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Brand Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Brand Name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Date Picker */}
                                <div>
                                    <FormItem>
                                        <FormLabel>Select a Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !dateAdded && "text-muted-foreground"
                                                        )}
                                                        onClick={() => setValue("dateAdded", dateAdded)}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {dateAdded ? format(dateAdded, "dd-MM-yyyy") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={dateAdded}
                                                        onSelect={(date: any) => setValue("dateAdded", date)}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage>
                                            {dateAdded ? null : <span>Please pick a date.</span>}
                                        </FormMessage>
                                    </FormItem>
                                </div>

                                {/* Category */}
                                <div>
                                    <FormField
                                        control={control}
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
                                                                <SelectLabel>Select Category</SelectLabel>
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

                                {/* Status */}
                                <div>
                                    <FormField
                                        control={control}
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
                                                                <SelectLabel>Select Status</SelectLabel>
                                                                <SelectItem value="0">Active</SelectItem>
                                                                <SelectItem value="1">Inactive</SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <FormField
                                        control={control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your brand description"
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

export default AddBrand;
