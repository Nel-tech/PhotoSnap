import { OurFeatures } from "../_Mock_/Helper"
import Image from "next/image";

function Features() {
    return (
        <div className="mt-[10rem] grid self-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {OurFeatures.map((feat) => {
                return (
                    <div key={feat.id} className="flex flex-col items-center">
                        <Image src={feat.img} alt={feat.title} width={80}  />
                        <h1 className="font-bold tracking-widest">{feat.title}</h1>
                        <p className="py-[2rem] max-w-[17rem] text-sm tracking-wider leading-relaxed text-center opacity-40 lg:max-w-[20rem]">{feat.info}</p>
                    </div>
                );
            })}
        </div>
    )
}

export default Features;
