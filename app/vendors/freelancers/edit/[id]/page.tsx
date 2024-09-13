"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select as ShadcnSelect, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from 'axios';
import axiosInstance from "@/app/Instance";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";



interface FreelancerAdd {
  freelancername: string;
  username: string;
  phone: string;
  email: string;
  plans: { value: string; label: string }[];
  status: string;
  dor: string;
}

const EditFreeLancer = () => {
  const [freelancer, setFreelancer] = useState<FreelancerAdd | null>(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();

  const formSchema = z.object({
    freelancername: z.string().min(2, "Freelancer name must be at least 2 characters."),
    username: z.string().min(1, "Username is required."),
    phone: z.string().min(1, "Phone number is required."),
    email: z.string().email("Invalid email address."),
    plans: z.array(z.object({ value: z.string(), label: z.string() })).nonempty("At least one plan must be selected."),
    status: z.string().min(1, "Status is required."),
    dor: z.string().min(1, "Date Of Registration Is Required."),
  });

  const colourOptions = [
    { value: 'plan1', label: 'Plan 1' },
    { value: 'plan2', label: 'Plan 2' },
    { value: 'plan3', label: 'Plan 3' },
    { value: 'plan4', label: 'Plan 4' },
  ];

  const form = useForm<FreelancerAdd>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      freelancername: "",
      username: "",
      phone: "",
      email: "",
      plans: [],
      status: "0",
      dor: "",
    },
  });

  const getFreeLancerById = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/freelancers/${id}`);
      setFreelancer(res.data);
      form.reset(res.data);
      setDate(new Date(res.data.dor));
    } catch (error) {
      console.error("Error fetching freelancer:", error);
      toast({
        title: "Fetch Error",
        description: "There was an error fetching the freelancer details.",
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    if (typeof id === 'string') {
      getFreeLancerById(id);
    }
  }, [id]);

  const onSubmit: SubmitHandler<FreelancerAdd> = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.put(`/freelancers/${id}`, { ...data, dor: date?.toISOString() }, {
        headers: { 'Content-Type': 'application/json' },
      });

      toast({
        title: "Freelancer Updated",
        description: "Freelancer updated successfully!",
        variant: 'success'
      });
      router.push('/vendors/freelancers');
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
              <h2 className="text-2xl font-bold tracking-tight">Edit Freelancer</h2>
              <p className="text-gray-400 text-sm">
                Fill the form and update the freelancer details.
              </p>
            </div>
            <Separator className="my-6" />
          </div>
        </CardHeader>
        <CardContent className="px-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Freelancer Name */}
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="freelancername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Freelancer Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Name of Freelancer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Username */}
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Phone */}
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Your Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Plan
                <div className="col-span-2 md:col-span-1">
                  <Controller
                    name="plans"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <ShadcnSelect
                        isMulti
                        options={colourOptions}
                        onChange={(selectedOptions: any) => {
                          const values = selectedOptions.map((option: any) => ({ value: option.value, label: option.label }));
                          onChange(values);
                        }}
                        value={value.map((plan: { value: string; label: string }) => ({ value: plan.value, label: plan.label }))}
                      />
                    )}
                  />
                </div> */}

                {/* Date of Registration
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="dor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Of Registration</FormLabel>
                        <br />
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                onChange={setDate}
                                value={date}
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}

                {/* Status */}
                <div className="col-span-2 md:col-span-1">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <ShadcnSelect
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="0">Active</SelectItem>
                                <SelectItem value="1">Inactive</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </ShadcnSelect>
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

export default EditFreeLancer;
