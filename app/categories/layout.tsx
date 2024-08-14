import MasterLayout from '@/components/MasterLayout'
import React from 'react'
import Categories from './page'

const CategoryLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <MasterLayout>
             {children}
            </MasterLayout>
        </div>
    )
}

export default CategoryLayout
