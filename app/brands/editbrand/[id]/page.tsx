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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  brandName: z.string().min(2, { message: "Brand name must be at least 2 characters." }),
  description: z.string().optional(),
  image: z.string().optional(),
});

const EditBrand = () => {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: "",
      brandName: "",
      description: "",
    },
  });

  const { control, handleSubmit } = form;

  useEffect(() => {
    if (id) {
      const getBrandById = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(`/brands/${id}`);
          setCoupon(res?.data);
          console.log(res?.data);
          form.reset({
            image: "",
            brandName: res?.data?.brandName,
            description: res?.data?.description,
          });
        } catch (error) {
          console.error("Error fetching Brand:", error);
          toast({
            title: "Fetch Error",
            description: "There was an error fetching the Brand details.",
            variant: 'destructive'
          });
        } finally {
          setLoading(false);
        }
      };

      getBrandById();
    }
  }, [id, form, toast]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formattedData = {
      ...data,
    };

    try {
      await axiosInstance.put(`/brands/${id}`, formattedData, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast({
        title: "Brand Updated",
        description: "Brand updated successfully!",
        variant: 'success'
      });
      router.push('/brands');
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error updating the brand:", error.response?.data || error.message);
        toast({
          title: "Update Error",
          description: `There was an error updating the brand: ${error.response?.data?.error || error.message}`,
          variant: 'destructive'
        });
      } else {
        console.error("Unexpected error:", error);
        toast({
          title: "Update Error",
          description: "There was an unexpected error updating the brand.",
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
              <h2 className="text-2xl font-bold tracking-tight">Edit Brand</h2>
              <p className="text-gray-400 text-sm">
                Fill the form to edit the Brand details.
              </p>
            </div>
            <Separator className="my-6" />
          </div>
        </CardHeader>
        <CardContent className="px-10">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Brand Image */}
                <div>
                  <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Image</FormLabel>
                        <FormControl>
                          <Input id="image" type="file" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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

export default EditBrand;
