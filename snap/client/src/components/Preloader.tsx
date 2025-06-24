// import { useState, useEffect, useRef } from "react"
// import { Camera } from "lucide-react"

// type PreloaderProps = {
//     onLoadingComplete: ()=> void;
// }

// export default function Preloader({ onLoadingComplete }: PreloaderProps) {
//     const [isLoading, setIsLoading] = useState(true)
//     const [dots, setDots] = useState("")
//     const [shutterTriggered, setShutterTriggered] = useState(false)
//     const audioRef = useRef<HTMLAudioElement | null>(null)

//     // Play custom shutter sound from audio file
//     const playShutterSound = () => {
//         try {
//             if (audioRef.current) {
//                 audioRef.current.currentTime = 0
//                 audioRef.current.play().catch(error => {
//                     console.log('Audio playback failed:', error)
//                 })
//             }
//         } catch (error) {
//             console.log('Audio not supported:', error)
//         }
//     }

//     useEffect(() => {
//         if (!isLoading) return;

//         // Animate loading dots
//         const dotsInterval = setInterval(() => {
//             setDots((prev) => {
//                 if (prev === "...") return ""
//                 return prev + "."
//             })
//         }, 500)

//         // Trigger shutter after 3 seconds
//         const shutterTimeout = setTimeout(() => {
//             setShutterTriggered(true)
//             playShutterSound()
//             setTimeout(() => {
//                 setIsLoading(false)
                
//                 if (onLoadingComplete) {
//                     onLoadingComplete()
//                 }
//             }, 800)
//         }, 3000)

//         return () => {
//             clearInterval(dotsInterval)
//             clearTimeout(shutterTimeout)
//         }
//     }, [isLoading, onLoadingComplete])

//     if (!isLoading) {
//         return null 
//     }

//     return (
//         <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        
//             <audio
//                 ref={audioRef}
//                 preload="auto"
//                 volume={0.6}
//             >
              
//                 <source src="/preview.mp3" type="audio/mpeg" />
//                 Your browser does not support the audio element.
//             </audio>

           
//             <div className={`text-center relative z-0 ${shutterTriggered ? 'animate-shake' : ''}`}>
                
//                 <div className="mb-6">
//                     <Camera
//                         size={64}
//                         className={`text-white mx-auto transition-all duration-200 ${shutterTriggered ? 'text-blue-400 drop-shadow-lg' : 'animate-pulse'
//                             }`}
//                     />
//                 </div>

                
//                 <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">PHOTOSNAP</h1>
//                 <p className="text-blue-300 mb-8 text-lg">
//                     Loading{dots}
//                 </p>

                
//                 <div className="flex justify-center space-x-2">
//                     {[0, 1, 2].map((i) => (
//                         <div
//                             key={i}
//                             className={`w-3 h-3 rounded-full bg-blue-400 transition-all duration-300 ${shutterTriggered ? 'scale-0' : 'animate-bounce'
//                                 }`}
//                             style={{
//                                 animationDelay: `${i * 0.2}s`,
//                                 animationDuration: '1s'
//                             }}
//                         />
//                     ))}
//                 </div>
               
//             </div>

//             <style jsx>{`
//                 @keyframes shake {
//                     0%, 100% { transform: translateX(0); }
//                     25% { transform: translateX(-2px); }
//                     75% { transform: translateX(2px); }
//                 }
                
//                 @keyframes focus-1 {
//                     0% { opacity: 0; transform: scale(2); }
//                     50% { opacity: 1; transform: scale(1); }
//                     100% { opacity: 0; transform: scale(0.8); }
//                 }
                
//                 @keyframes focus-2 {
//                     0% { opacity: 0; transform: scale(1.5); }
//                     60% { opacity: 1; transform: scale(1); }
//                     100% { opacity: 0; transform: scale(0.9); }
//                 }
                
//                 @keyframes focus-3 {
//                     0% { opacity: 0; transform: scale(1.2); }
//                     70% { opacity: 1; transform: scale(1); }
//                     100% { opacity: 0; transform: scale(1.1); }
//                 }
                
//                 @keyframes fade-in {
//                     from { opacity: 0; transform: translateY(10px); }
//                     to { opacity: 1; transform: translateY(0); }
//                 }
                
//                 .animate-shake {
//                     animation: shake 0.3s ease-in-out;
//                 }
                
//                 .animate-focus-1 {
//                     animation: focus-1 0.8s ease-out;
//                 }
                
//                 .animate-focus-2 {
//                     animation: focus-2 0.8s ease-out 0.1s;
//                 }
                
//                 .animate-focus-3 {
//                     animation: focus-3 0.8s ease-out 0.2s;
//                 }
                
//                 .animate-fade-in {
//                     animation: fade-in 0.6s ease-out;
//                 }
//             `}</style>
//         </div>
//     )
// }