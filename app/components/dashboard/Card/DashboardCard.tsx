import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { ReactElement } from "react";

interface CardsProps {
    title: string;
    Icon: ReactElement;
    number: number | string;
    description?: string;
    loading: boolean; 
}

const DashboardCard = ({ title, Icon, number, description, loading }: CardsProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {loading ? (
                    <Skeleton className="h-6 w-1/2" />
                ) : (
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                )}
                <div>
                    {loading ? (
                        <Skeleton className="h-6 w-6" />
                    ) : (
                        Icon
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <>
                        <Skeleton className="h-8 w-24 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </>
                ) : (
                    <>
                        <div className="text-2xl font-bold">{number}</div>
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

export default DashboardCard;
