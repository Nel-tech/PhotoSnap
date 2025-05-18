

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Upload-Page | PhotoSnap',
    description: "Upload Your Story",
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
