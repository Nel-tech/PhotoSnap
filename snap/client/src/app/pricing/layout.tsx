
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing | PhotoSnap',
    description: "Our Pricing",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            {children}
        </div>
    );
}
