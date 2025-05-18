

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stories | PhotoSnap',
    description: "Stories",
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
           
            {children}
        </div>
    );
}
