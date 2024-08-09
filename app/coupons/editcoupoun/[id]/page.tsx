"use client";

import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useRouter, useParams } from "next/navigation";

// Define form schema with correct validation
const formSchema = z.object({
    amount_of_discount: z.string().regex(/^\d+(,\d{3})*$/, "Amount of discount must be a number with."),
    percent_of_discount: z.string().regex(/^\d+%$/, "Percent of discount must be in percentage format."),
    number_of_coupons: z.string().regex(/^\d+$/, "Number of coupons must be a positive integer."),
    minimum_order_amount: z.string().regex(/^\d+(,\d{3})*$/, "Minimum order amount must be a number with commas."),
    maximum_discount: z.string().regex(/^\d+(,\d{3})*$/, "Maximum discount must be a number with commas."),
});

const EditCoupon = () => {
    const [loading, setLoading] = useState(false);
    const [coupon, setCoupon] = useState(null);
    const { toast } = useToast();
    const router = useRouter();
    const { id } = useParams();

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

    useEffect(() => {
        if (id) {
            const getCouponById = async () => {
                setLoading(true);
                try {
                    const res = await axiosInstance.get(`/coupons/${id}`);
                    setCoupon(res?.data);
                    form.reset({
                        image: "",
                        amount_of_discount: String(res?.data.amount_of_discount) || "",
                        percent_of_discount: String(res?.data.percent_of_discount) || "",
                        number_of_coupons: String(res?.data.number_of_coupons) || "",
                        minimum_order_amount: String(res?.data.minimum_order_amount) || "",
                        maximum_discount: String(res?.data.maximum_discount) || "",
                    });
                } catch (error) {
                    console.error("Error fetching Coupon:", error);
                    toast({
                        title: "Fetch Error",
                        description: "There was an error fetching the Coupon details.",
                        variant: 'destructive'
                    });
                } finally {
                    setLoading(false);
                }
            };

            getCouponById();
        }
    }, [id, form, toast]);

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
            await axiosInstance.put(`/coupons/${id}`, formattedData, {
                headers: { 'Content-Type': 'application/json' },
            });

            toast({
                title: "Coupon Updated",
                description: "Coupon updated successfully!",
                variant: 'success'
            });
            router.push('/coupons');
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error("Error updating the coupon:", error.response?.data || error.message);
                toast({
                    title: "Update Error",
                    description: `There was an error updating the coupon: ${error.response?.data?.error || error.message}`,
                    variant: 'destructive'
                });
            } else {
                console.error("Unexpected error:", error);
                toast({
                    title: "Update Error",
                    description: "There was an unexpected error updating the coupon.",
                    variant: 'destructive'
                });
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
                            <h2 className="text-2xl font-bold tracking-tight">Edit Coupon</h2>
                            <p className="text-gray-400 text-sm">
                                Update the details of the coupon below.
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
                                        name="image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Coupon Image</FormLabel>
                                                <FormControl>
                                                    <Input id="image" type="file" disabled={loading} {...field} />
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
                                        name="amount_of_discount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Amount of Discount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Enter Amount of Discount (e.g., 900)"
                                                        disabled={loading}
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
                                                        disabled={loading}
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
                                                        disabled={loading}
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
                                                        disabled={loading}
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
                                                        disabled={loading}
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

export default EditCoupon;
