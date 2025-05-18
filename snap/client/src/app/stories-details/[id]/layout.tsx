

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stories-Details | PhotoSnap',
    description: "Stories-Details",
};

export default function DetailsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
