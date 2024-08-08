"use client";
import axiosInstance from '@/app/Instance';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  status: number;
  dateOfJoining: string;
  profilePic: string;
}

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get(`/userslist/${id}`);
          setUser(response?.data);
          console.log(response?.data);
        } catch (error) {
          setError('Error fetching user data');
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

 

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>User Details</h1>
      <div>
        <img src={user.profilePic || '/default-avatar.png'} alt={user.name} width={100} />
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>Mobile: {user.mobile}</p>
        <p>Status: {user.status === 0 ? 'Active' : 'Blocked'}</p>
        <p>Date of Joining: {user.dateOfJoining}</p>
      </div>
    </div>
  );
};

export default SingleUser;
