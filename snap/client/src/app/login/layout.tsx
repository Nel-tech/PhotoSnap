// app/admin/layout.tsx

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | PhotoSnap',
    description: "Login into your account",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
