
import Image from 'next/image'
import Story from '@/images/shared/desktop/bg-beta.jpg'
import Link from 'next/link'
function FeaturedStory() {
    return (
        <section className='relative mt-[5rem]'>
            <div className='absolute top-[.1rem] left-0 h-[16.3rem] w-[0.3rem] bg-gradient-to-b from-orange-300 via-pink-500 to-blue-500 transform rotate-180'></div>
            <Image src={Story} alt="we're in beta get your invite today"  />
            <div className= 'absolute inset-0  flex self-center items-center justify-evenly text-white'>

                <p className='text-4xl uppercase max-w-[20rem] tracking-widest leading-relaxed '>we're in beta get your invite today</p>
                <Link href='/'>
                    <p className='text-sm hover:underline'>READ STORY  <span aria-hidden="true" className="ml-2 text-xl">&rarr;</span></p>
                </Link>
            </div>
        </section>
    )
}

export default FeaturedStory