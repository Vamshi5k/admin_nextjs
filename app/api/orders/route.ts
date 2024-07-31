import { NextResponse } from "next/server";
import { orders } from "@/app/ApiData/OrdersData";

export async function GET(req: Request) {
    return NextResponse.json(orders);
}