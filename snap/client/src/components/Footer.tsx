'use client'
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FooterLogo from '../../public/images/shared/desktop/Footerlogo.svg'

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white py-10 mt-[6rem]">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
                <div className="flex flex-col gap-10 md:flex-row md:justify-between md:items-start">

                    {/* Logo & Socials */}
                    <div className="flex flex-col items-center md:items-start gap-6">
                        <Link href='/'> 
                        <Image src={FooterLogo} alt="Logo" width={160} height={50}  priority />
                        </Link>

                        {/* Social Icons */}
                        <div className="flex gap-4">
                            <a href="https://github.com/Nel-tech" target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visit Nelson Adegbasa's GitHub Profile" className="text-gray-400 hover:text-white transition">
                                <Github className="w-6 h-6" />
                            </a>
                           
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col items-center md:items-start gap-4 text-sm tracking-wider">
                        <Link href="/features" className="text-gray-300 hover:text-white transition">FEATURES</Link>
                        <Link href="/pricing" className="text-gray-300 hover:text-white transition">PRICING</Link>
                    </nav>

                    {/* Copyright */}
                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-gray-400 text-sm tracking-widest text-center md:text-right">
                            &copy; {currentYear} PHOTOSNAP
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
