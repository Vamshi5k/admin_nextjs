"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Overview } from "./components/dashboard/overview";
import { RecentSales } from "./components/dashboard/recentsales";
import DashboardCard from "./components/dashboard/Card/DashboardCard";
import { Camera, LampDesk, FerrisWheel, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import axiosInstance from "./Instance";
import { Skeleton } from "@/components/ui/skeleton";
import MasterLayout from "@/components/MasterLayout";

interface User {
  id: number;
  name: string;
}

interface Freelancer {
  id: number;
  name: string;
}

interface Studio {
  id: number;
  name: string;
}

interface ThemePark {
  id: number;
  name: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [themeparks, setThemeparks] = useState<ThemePark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, freelancersRes, studiosRes, themeParksRes] = await Promise.all([
        axiosInstance.get('/userslist'),
        axiosInstance.get('/freelancers'),
        axiosInstance.get('/studios'),
        axiosInstance.get('/themeparks'),
      ]);

      setUsers(usersRes?.data);
      setFreelancers(freelancersRes?.data);
      setStudios(studiosRes?.data);
      setThemeparks(themeParksRes?.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MasterLayout>
      <main>
        {/* CARDS SECTION STARTS HERE */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {loading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <DashboardCard
                title={"Freelancers"}
                Icon={<Camera size={20} aria-label="Freelancers" />}
                number={freelancers.length}
                loading={loading}
              />
              <DashboardCard
                title={"Studios"}
                Icon={<LampDesk size={20} aria-label="Studios" />}
                number={studios.length}
                loading={loading}
              />
              <DashboardCard
                title={"Theme Parks"}
                Icon={<FerrisWheel size={20} aria-label="Theme Parks" />}
                number={themeparks.length}
                loading={loading}
              />
              <DashboardCard
                title={"Total Customers"}
                Icon={<Users size={20} aria-label="Total Customers" />}
                number={users.length}
                loading={loading}
              />
            </>
          )}
        </div>
        {/* CARDS SECTION ENDS HERE */}
      </main>
    </MasterLayout>
  );
}
