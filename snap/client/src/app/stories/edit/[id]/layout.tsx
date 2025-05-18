

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Edit Story | PhotoSnap',
    description: "Edit your story",
};

export default function EditLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
