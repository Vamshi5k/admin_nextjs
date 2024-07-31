import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface CardsProps {
    title: any;
    Icon: any;
    number: any;
    description: any
}

const DashboardCard = ({ title, Icon, number, description }: CardsProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <div>
                    {Icon}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{number}</div>
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    )
}

export default DashboardCard