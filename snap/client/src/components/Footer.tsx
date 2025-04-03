'use client'
import { Github, Linkedin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterLogo from '@/images/shared/desktop/Footerlogo.svg'

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white py-10 mt-[6rem]">
            <div className=" mx-auto px-6 md:px-12 lg:px-20">
                <div className="flex  md:flex-row justify-between items-center md:items-start gap-8">

                    {/* Logo & Socials */}
                    <div className="flex flex-col items-center md:items-start">
                        <Image src={FooterLogo} alt="Logo" width={160} height={50} />

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-[3rem]">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <X className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Github className="w-6 h-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex gap-[3rem] items-center md:items-start space-y-2">
                        <Link href="/features" className="footer-links">FEATURES</Link>
                        <Link href="/pricing" className="footer-links">PRICING</Link>
                    </nav>

                    {/* Call-to-Action & Copyright */}
                    <div className="flex flex-col items-center md:items-end">
                        
                        <p className="text-gray-400 text-base tracking-widest">&copy; {currentYear} PHOTOSNAP</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
