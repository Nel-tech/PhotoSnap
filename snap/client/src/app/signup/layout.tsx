

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Signup | PhotoSnap',
    description: "Signup",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
