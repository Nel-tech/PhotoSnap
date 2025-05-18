// app/admin/layout.tsx

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Collection | PhotoSnap',
    description: "View Your Bookmarked and Likes",
};

export default function CollectionLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
