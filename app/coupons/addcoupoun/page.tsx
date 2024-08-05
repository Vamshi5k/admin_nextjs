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

const AddCoupon = () => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    // Update the form validation schema
    const formSchema = z.object({
        // image: z.string().optional(),
        amount_of_discount: z.string().regex(/^\d+$/, "Amount of discount must be a number."),
        percent_of_discount: z.string().regex(/^\d+%$/, "Percent of discount must be in percentage format."),
        number_of_coupons: z.string().regex(/^\d+$/, "Number of coupons must be a positive integer."),
        minimum_order_amount: z.string().regex(/^\d+(,\d{3})*$/, "Minimum order amount must be a number with commas."),
        maximum_discount: z.string().regex(/^\d+(,\d{3})*$/, "Maximum discount must be a number with commas."),
    });

    // Set default values for the form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            image: "",
            amount_of_discount: "",
            percent_of_discount: "",
            number_of_coupons: "",
            minimum_order_amount: "",
            maximum_discount: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        const formattedData = {
            ...data,
            amount_of_discount: parseFloat(data.amount_of_discount),
            number_of_coupons: parseInt(data.number_of_coupons, 10),
            minimum_order_amount: data.minimum_order_amount.replace(/,/g, ''),
            maximum_discount: data.maximum_discount.replace(/,/g, ''),
        };

        try {
            await axiosInstance.post('/coupons', formattedData, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast({
                title: "Coupon Added",
                description: "Coupon added successfully!",
                variant: 'success'
            });
            router.push('/coupons');
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
                            <h2 className="text-2xl font-bold tracking-tight">Add Coupon</h2>
                            <p className="text-gray-400 text-sm">
                                Fill the form and add the coupon to your list.
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
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Coupon Image</FormLabel>
                                                <FormControl>
                                                    <Input id="image" type="file" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                
                                {/* Column 1 */}
                                {/* <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="coupon_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Coupon ID</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter Coupon ID (e.g., CUP008)"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div> */}
                                <div className="col-span-2 md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name="amount_of_discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount of Discount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Amount of Discount (e.g., 900)"
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
                                        name="percent_of_discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Percent of Discount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Percent of Discount (e.g., 10%)"
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
                                        name="number_of_coupons"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Number of Coupons</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Number of Coupons (e.g., 55)"
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
                                        name="minimum_order_amount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Minimum Order Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Minimum Order Amount (e.g., 5,000)"
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
                                        name="maximum_discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Maximum Discount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Maximum Discount (e.g., 1,125)"
                                                        {...field}
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

export default AddCoupon;
