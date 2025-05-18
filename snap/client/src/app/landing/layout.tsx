

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home | PhotoSnap',
    description: "Home",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
