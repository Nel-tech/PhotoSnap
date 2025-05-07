'use client'
// import BackgroundImage from '../../../public/images/stories/desktop/moon-of-appalacia.jpg'
// import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import cookie from 'js-cookie'
import { useAuthStore } from "@/store/useAuthStore"
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
function HeroSection() {
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


    const { data, isLoading } = useQuery({
        queryKey: ['get-featured-stories'],
        queryFn: async () => {
            try {
                const token = cookie.get('token');

                if (!token) throw new Error("No token found");

                const res = await axios.get(`${API_URL}api/v1/stories/featured-stories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

        
                return res.data.data;
            } catch (err) {
                throw err; 
            }
        },
        enabled: isAuthenticated,
      
    });
    if (isLoading || !data) {
        return (
            <section className="h-screen flex items-center justify-center text-center">
                <Loader2 style={{ animation: 'spin 1s linear infinite' }} className="h-8 w-8 text-gray-500 mb-2" />
                <p className="text-gray-500">Loading featured story...</p>
            </section>
        );
    }
   

    return (
        <section className="relative">
            <div
                className="relative bg-cover bg-center h-screen w-full pt-[6rem]"
                style={{ backgroundImage: `url(${data?.image})` }}
            >
                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-black bg-opacity-40 z-0" /> */}

                {/* Text Content */}
                <div className="relative text-black ml-[1rem] lg:ml-[5rem] hidden md:block lg:block">
                    <h1 className=" text-sm tracking-widest">FEATURED STORY</h1>
                    <h2 className=" text-4xl tracking-widest leading-normal uppercase pt-[1rem]">
                        {data?.title}
                    </h2>
                    <div className="pt-[1rem] flex items-center gap-2">
                        <span className=" text-sm">By {data?.author}</span>
                    </div>
                    <p className="pt-[1rem]  text-sm tracking-wide leading-[24px] max-w-[27rem]">
                        {data?.description.substring(0, 150) + "..."}
                    </p>
                    <Link href={`/stories-details/${data?._id}`}>
                        <Button className=" -ml-[1rem] text-sm uppercase cursor-pointer">
                            Read the story <ArrowRight />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Mobile version */}
            <Card className="rounded-none bg-black h-[400px] md:hidden lg:hidden">
                <div className="ml-[1rem] lg:ml-[5rem]">
                    <h1 className="text-white text-sm tracking-widest">FEATURED STORY</h1>
                    <h2 className="text-white text-4xl max-w-[15rem] tracking-widest leading-normal uppercase pt-[1rem]">
                        {data?.title}
                    </h2>
                    <div className="pt-[1rem] flex items-center gap-2">
                        <span className="text-white text-sm">By {data?.author}</span>
                    </div>
                    <p className="pt-[1rem] text-white text-sm tracking-wide leading-[30px] max-w-[27rem] opacity-55">
                        {data?.description.substring(0, 150) + "..."}
                    </p>
                    <Link
                        href={`/stories-details/${data?._id}`}
                        className="text-sm tracking-wider text-white pt-4 inline-block"
                    >
                        READ STORY <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </Card>
        </section>

    );
}

export default HeroSection;
