import Link from 'next/link'

function FeaturedStory() {
    return (
        <section className=" relative">

            {/* Gradient Bar */}
            <div
                className="
          absolute 
          top-[-0.2rem] 
          left-[-0.1rem] 
          h-[0.2rem] 
          w-full 
          rotate-360 
          bg-gradient-to-r 
          from-orange-300 
          via-pink-500 
          to-blue-500 
          transform

          
          lg:z-50
          lg:h-[15rem] 
          lg:w-[0.3rem] 
          lg:rotate-180 
          lg:top-[2rem]
          lg:bg-gradient-to-b
        "
            ></div>

            {/* Background Image Section */}
            <div
                className="bg-cover bg-center bg-no-repeat h-[300px] md:h-[300px] lg:h-[300px] flex flex-col items-center justify-evenly text-white relative lg:flex-row"
                style={{
                    backgroundImage: "url('/images/shared/desktop/bg-beta.jpg')",
                }}
            >
                <p className="text-3xl font-bold tracking-wider leading-relaxed uppercase max-w-[15rem]  text-left md:text-left lg:text-center lg:tracking-widest lg:leading-relaxed">
                    we&apos;re in beta get your invite today
                </p>
                <Link href="/">
                    <p className="text-base text-left ml-[-7rem]">
                        READ STORY <span aria-hidden="true" className="">&rarr;</span>
                    </p>
                </Link>
            </div>
        </section>
    );
}

export default FeaturedStory;
