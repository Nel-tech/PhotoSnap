'use client'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useFeaturedStories } from '../hooks/useApp'
import Image from 'next/image'
function HeroSection() {
   


    const { data, isLoading, isError } = useFeaturedStories()
    if (isLoading) {
        return (
            <section className="h-screen flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 text-gray-500 mb-2 animate-spin" />
                <p className="text-gray-500">Loading featured story...</p>
            </section>
        );
    }

    // Error state
    if (isError) {
        return (
            <section className="h-screen flex flex-col items-center justify-center text-center">
                <p className="text-red-500 mb-4">Failed to load featured story</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                </Button>
            </section>
        );
    }

    // No data state
    if (!data) {
        return (
            <section className="h-screen flex flex-col items-center justify-center text-center">
                <p className="text-gray-500">No featured story available</p>
            </section>
        );
    }

   
    const truncateDescription = (text: string, maxLength: number = 150) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };
    return (
        <section className="relative">
            {/* Desktop/Tablet version */}
            <div className="relative h-screen w-full pt-[6rem] hidden md:block">
                {/* Background Image */}
                <div className="absolute inset-0 -z-10">
                    <Image
                        src={data.image || "/placeholder-hero.jpg"}
                        alt={data.title || "Featured story"}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Overlay directly on top of the image */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Text Content - selectable and in front */}
                <div className="relative z-10 text-white ml-4 lg:ml-20 pt-20 select-text">
                    <h1 className="text-sm tracking-widest font-medium uppercase">
                        Featured Story
                    </h1>
                    <h2 className="text-4xl lg:text-5xl tracking-widest leading-tight uppercase pt-4 max-w-4xl">
                        {data.title}
                    </h2>

                    {data.author && (
                        <div className="pt-4 flex items-center gap-2">
                            <span className="text-sm">By {data.author}</span>
                        </div>
                    )}

                    {data.description && (
                        <p className="pt-4 text-sm tracking-wide leading-6 max-w-md">
                            {truncateDescription(data.description)}
                        </p>
                    )}

                    <div className="pt-6">
                        <Link href={`/stories-details/${data._id}`}>
                            <Button
                                className="text-sm uppercase cursor-pointer hover:shadow-lg transition-all duration-200"
                                size="lg"
                            >
                                Read the story <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>


            {/* Mobile version */}
            <div className="md:hidden">
                <Card className="rounded-none bg-black min-h-[400px] relative overflow-hidden">
                    {/* Background image for mobile */}
                    {data.image && (
                        <div className="absolute inset-0 opacity-30">
                            <Image
                                src={data.image}
                                alt={data.title || "Featured story"}
                                fill
                                className="object-cover"
                                sizes="100vw"
                            />
                        </div>
                    )}

                    <div className="relative z-10 p-4 pt-8">
                        <h1 className="text-white text-sm tracking-widest font-medium uppercase">
                            Featured Story
                        </h1>
                        <h2 className="text-white text-2xl max-w-xs tracking-widest leading-tight uppercase pt-4">
                            {data.title}
                        </h2>

                        {data.author && (
                            <div className="pt-4 flex items-center gap-2">
                                <span className="text-white text-sm">By {data.author}</span>
                            </div>
                        )}

                        {data.description && (
                            <p className="pt-4 text-white text-sm tracking-wide leading-7 max-w-sm opacity-90">
                                {truncateDescription(data.description)}
                            </p>
                        )}

                        <Link
                            href={`/stories-details/${data._id}`}
                            className="text-sm tracking-wider text-white pt-6 inline-block hover:underline transition-all duration-200"
                        >
                            READ STORY <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </section>
    );
}
export default HeroSection;
