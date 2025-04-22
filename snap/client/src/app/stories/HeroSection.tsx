'use client'
import BackgroundImage from '../../../public/images/stories/desktop/moon-of-appalacia.jpg'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
function HeroSection() {
    const [prevMonth, setPrevMonth] = useState('')

    useEffect(() => {
        const previous = () => {
            const date = new Date();
            const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            const formatted = prevMonthDate.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
            });
            setPrevMonth(formatted);
        };
        previous();
    }, []);

    return (
        <section>
            <div
                className="bg-cover bg-center  h-screen w-full pt-[6rem]"
                style={{ backgroundImage: `url(${BackgroundImage.src})` }}
            >
                <div className='ml-[1rem] lg:ml-[5rem] hidden md:block lg:block'>
                    <h1 className="text-white text-sm tracking-widest ">LAST MONTH'S FEATURED STORY</h1>
                    <h2 className="text-white text-4xl max-w-[15rem] tracking-widest leading-normal uppercase pt-[1rem] ">Hazy Full Moon of Appalacia</h2>
                    <div className=" pt-[1rem] flex items-center gap-2">
                        <h3 className="text-white  text-sm opacity-55 ">{prevMonth} </h3> <span className='text-white text-sm'>By John Appleseed</span>
                    </div>
                    <p className="pt-[1rem] text-white text-sm tracking-wide leading-[24px] max-w-[27rem] opacity-55">

                        The dissected plateau area, while not actually made up of geological mountains,
                        is popularly called "mountains," especially in eastern Kentucky and West Virginia,
                        and while the ridges are not high, the terrain is extremely rugged.

                    </p>
                    <Button className="text-white -ml-[1rem] text-sm uppercase">Read the story <span><ArrowRight /></span></Button>
                </div>
            </div>

            <Card className="rounded-none bg-black h-[122vh]  md:hidden lg:hidden">
                <div className='ml-[1rem] lg:ml-[5rem]'>
                    <h1 className="text-white text-sm tracking-widest ">LAST MONTH'S FEATURED STORY</h1>
                    <h2 className="text-white text-4xl max-w-[15rem] tracking-widest leading-normal uppercase pt-[1rem] ">Hazy Full Moon of Appalacia</h2>
                    <div className=" pt-[1rem] flex items-center gap-2">
                        <h3 className="text-white  text-sm opacity-55 ">{prevMonth} </h3> <span className='text-white text-sm'>By John Appleseed</span>
                    </div>
                    <p className="pt-[1rem] text-white text-sm tracking-wide leading-[30px] max-w-[27rem] opacity-55">

                        The dissected plateau area, while not actually made up of geological mountains,
                        is popularly called "mountains," especially in eastern Kentucky and West Virginia,
                        and while the ridges are not high, the terrain is extremely rugged.

                    </p>
                    <Button className="text-white -ml-[1rem] text-sm uppercase">Read the story <span><ArrowRight /></span></Button>
                </div>
            </Card>
        </section>
    );
}

export default HeroSection;
