'use client'

import Link from "next/link";

const Unauthorized = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-4 text-lg text-gray-700">
                You do not have permission to view this page.
            </p>
            <Link href="/" className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                Go Back Home
            </Link>
        </div>
    );
};

export default Unauthorized;
