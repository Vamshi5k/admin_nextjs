import axiosInstance from "@/app/Instance";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Define more specific types for better type safety
interface Transaction {
    user: string;
    amount: number;
    product: string;
}

export function RecentSales() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Fetch transactions with proper error handling
    const getTransactions = async () => {
        try {
            const res = await axiosInstance.get('/transactions');
            if (res?.data) {
                setTransactions(res.data);
                setLoading(false);
            }
            console.log("Latest Transactions:", res.data);
        } catch (error) {
            console.error(error);
            setError('Error Fetching Latest Transactions');
            toast({ description: 'Error Fetching Latest Transactions', variant: 'destructive' });
            setLoading(false);
        }
    }

    useEffect(() => {
        getTransactions();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <div className="flex items-center" key={index}>
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="ml-4 space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="ml-auto font-medium">
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">
            {transactions.slice(0, 5).map((item, index) => (
                <div className="flex items-center" key={index}>
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="font-bold text-lg capitalize">
                            {item.user[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{item.user}</p>
                        <p className="text-sm text-muted-foreground">{item.product}</p>
                    </div>
                    <div className="ml-auto font-medium">₹ {item.amount}</div>
                </div>
            ))}
        </div>
    );
}
