import React from 'react';
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';

const MasterLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='flex h-screen'>
            <div className="border-r border-slate-200">
                <Sidebar />
            </div>
            <div className='flex-1 flex flex-col'>
                <Navbar />
                <div className="flex-1 overflow-y-auto p-10">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MasterLayout;
