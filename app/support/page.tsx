"use client";
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dot } from 'lucide-react';
import axiosInstance from '../Instance';
import { useToast } from '@/components/ui/use-toast';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Ticket {
    ticket_id: string;
    subject: string;
    priority: string;
    type: string;
    client: string;
    requested_date: string;
}

const Support = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(8);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSupport = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosInstance.get('/support');
                if (res?.data) {
                    setTickets(res.data);
                }
            } catch (error) {
                console.error("Error Fetching Support Tickets", error);
                setError("Error Fetching Tickets Data");
                toast({
                    description: "Error Fetching Tickets Data",
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSupport();
    }, [toast]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(tickets.length / itemsPerPage);
    const currentTickets = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className='mt-10'>
            <Card>
                <CardHeader>
                    <CardTitle>Tickets</CardTitle>
                    <CardDescription className='mt-2'>
                        Overall {tickets.length} New Tickets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && <div>Loading...</div>}
                    {error && <div className='text-red-500'>{error}</div>}
                    {!loading && !error && (
                        <Table>
                            <TableHeader className='bg-black opacity-70 rounded-3xl'>
                                <TableRow>
                                    <TableHead className='text-white font-mono text-md'>TICKET ID</TableHead>
                                    <TableHead className='text-white font-mono text-md'>SUBJECT</TableHead>
                                    <TableHead className='text-white font-mono text-md'>PRIORITY</TableHead>
                                    <TableHead className='text-white font-mono text-md'>TYPE</TableHead>
                                    <TableHead className='text-white font-mono text-md'>CLIENT</TableHead>
                                    <TableHead className='text-white font-mono text-md'>REQUEST DATE</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTickets.map((item) => (
                                    <TableRow key={item.ticket_id}>
                                        <TableCell className='text-black font-bold'>#{item.ticket_id}</TableCell>
                                        <TableCell>{item.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                item.priority === "high" ? "error" :
                                                    item.priority === "low" ? "success" :
                                                        item.priority === "medium" ? "warning" : "default"
                                            }>
                                                <Dot size={20} /> {item.priority}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant='outline'>{item.type}</Badge>
                                        </TableCell>
                                        <TableCell>{item.client}</TableCell>
                                        <TableCell>{item.requested_date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            <div className='mt-3'>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem aria-disabled={currentPage === 1}>
                            <PaginationPrevious
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) handlePageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index} aria-current={currentPage === index + 1 ? 'page' : undefined}>
                                <PaginationLink
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handlePageChange(index + 1);
                                    }}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem aria-disabled={currentPage === totalPages}>
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default Support;
