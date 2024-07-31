import { NextResponse } from "next/server";
import { ProdutData } from "@/app/ApiData/ProductData";


export async function GET(req: Request) {
    return NextResponse.json(ProdutData);
}