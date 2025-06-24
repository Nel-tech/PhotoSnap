// "use client"

// import type React from "react"

// import { useEffect, useState, useRef } from "react"
// import Preloader from "./Preloader"

// export default function PreloaderWrapper({ children }: { children: React.ReactNode }) {
//     const [isLoading, setIsLoading] = useState(true)
//     const audioRef = useRef<HTMLAudioElement>(null)

//     useEffect(() => {
//         // Play shutter sound when preloader starts
//         if (audioRef.current) {
//             audioRef.current.play().catch(console.error)
//         }

//         const timer = setTimeout(() => {
//             // Play shutter sound when preloader finishes
//             if (audioRef.current) {
//                 audioRef.current.play().catch(console.error)
//             }

//             // Small delay after sound to let it finish
//             setTimeout(() => {
//                 setIsLoading(false)
//             }, 200)
//         }, 2000)

//         return () => clearTimeout(timer)
//     }, [])

//     return (
//         <>
//             <audio ref={audioRef} preload="auto">
//                 <source src="/sounds/camera-shutter.mp3" type="audio/mpeg" />
//             </audio>
//             {isLoading ? <Preloader isLoading={isLoading} onFinish={() => setIsLoading(false)} /> : children}
//         </>
//     )
// }
