import { NextResponse } from "next/server";
import { ProductData } from "@/app/ApiData/ProductData";

// GET request to fetch all products
export async function GET(req: Request) {
    return NextResponse.json(ProductData);
}



// POST request to create a new product

 
let nextId = ProductData.length + 1;

export async function POST(req: Request) {
    try {
        const newProduct = await req.json();
        newProduct.id = nextId++;
        ProductData.push(newProduct);
        return NextResponse.json(newProduct, { status: 201 }); // 201 Created status
    } catch (error) {
        console.error("Error processing POST request:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
