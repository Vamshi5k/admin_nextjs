import MasterLayout from '@/components/MasterLayout'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <MasterLayout>
                {children}
            </MasterLayout>
        </div>
    )
}

export default layout
