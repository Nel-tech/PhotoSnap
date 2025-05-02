
import React from "react";

const StorySkeleton = () => {
    return (
        <div className="min-h-screen bg-[#f8f7f4] px-4 py-16 flex items-center justify-center">
            <div className="w-full max-w-5xl animate-pulse">
                {/* Hero Section */}
                <div className="relative h-[80vh] overflow-hidden mb-12">
                    <div className="absolute inset-0 bg-[#e9e1d4]" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-16 left-0 px-4 w-full max-w-3xl space-y-4">
                        <div className="h-6 w-24 bg-white/30 rounded" />
                        <div className="h-10 w-3/4 bg-white/50 rounded" />
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-full bg-white/40" />
                            <div className="h-4 w-1/3 bg-white/40 rounded" />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-[#e9e1d4] rounded" />
                        <div className="h-4 w-5/6 bg-[#e9e1d4] rounded" />
                        <div className="h-4 w-3/4 bg-[#e9e1d4] rounded" />
                        <div className="h-4 w-2/3 bg-[#e9e1d4] rounded" />
                    </div>

                    <div className="my-16 space-y-2">
                        <div className="h-4 w-24 bg-[#e9e1d4] mx-auto rounded" />
                        <div className="flex justify-center flex-wrap gap-4 mt-4">
                            <div className="h-6 w-16 bg-[#e9e1d4] rounded" />
                            <div className="h-6 w-20 bg-[#e9e1d4] rounded" />
                            <div className="h-6 w-14 bg-[#e9e1d4] rounded" />
                        </div>
                    </div>

                    <div className="px-8 py-12 bg-[#f8f3ea] border-l-4 border-[#c7a17a]">
                        <div className="h-6 w-2/3 bg-[#e9e1d4] rounded mb-4" />
                        <div className="h-4 w-1/2 bg-[#e9e1d4] rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorySkeleton;
