import { NextResponse } from "next/server";
import { users } from "@/app/ApiData/UsersData";


export async function GET(req: Request) {
    return NextResponse.json(users);
}
