

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile | PhotoSnap',
    description: "Profile Page",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
