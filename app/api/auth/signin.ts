import type { NextApiRequest, NextApiResponse } from "next";
import axiosInstance from "@/app/Instance";

interface SignIn {
    username: string;
    password: string;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { username, password }: SignIn = req.body;

        try {
            const response = await axiosInstance.get(`/logins`, {
                params: { username, password }
            });

            if (response.data.legnth > 0) {
                res.status(200).json({ success: true })
            } else {
                res.status(401).json({ error: 'Invalid credtitals' })
            }
        } catch (error) {
            res.status(500).json({ error: "Server Error" })
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method${req.method} Not Allowed`)
    }
}