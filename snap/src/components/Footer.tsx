'use client'
import { Github, Linkedin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto px-6 md:px-12 lg:px-20">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">

                    {/* Logo & Socials */}
                    <div className="flex flex-col items-center md:items-start">
                        <Image src="/images/shared/desktop/Footerlogo.svg" alt="Logo" width={160} height={50} />

                        {/* Social Icons */}
                        <div className="flex gap-4 mt-4">
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
                    <nav className="flex flex-col items-center md:items-start space-y-2">
                        <Link href="/" className="footer-links">HOME</Link>
                        <Link href="/stories" className="footer-links">STORIES</Link>
                        <Link href="/features" className="footer-links">FEATURES</Link>
                        <Link href="/pricing" className="footer-links">PRICING</Link>
                    </nav>

                    {/* Call-to-Action & Copyright */}
                    <div className="flex flex-col items-center md:items-end">
                        <button className="featured-btn bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-300 transition">
                            GET AN INVITE <span aria-hidden="true">&rarr;</span>
                        </button>

                        <p className="text-gray-400 text-sm mt-4">&copy; {currentYear} Edition</p>
                    </div>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
