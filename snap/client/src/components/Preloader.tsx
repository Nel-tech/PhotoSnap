import React from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const Preloader: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
    if (!isLoading) return null;  // Don't render anything if not loading

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}  
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}  
        >
            <div className="flex flex-col items-center gap-4 text-center">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 3
                    }}
                    className="relative"
                >
                    <Camera size={48} className="text-primary" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-2xl font-bold tracking-tight">PHOTOSNAP</h1>
                    <div className="flex justify-center gap-2">
                        <motion.div
                            animate={{
                                scaleX: [0, 1, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                repeatDelay: 0.5,
                                ease: "easeInOut"
                            }}
                            className="h-0.5 w-12 bg-primary origin-left"
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Preloader;
