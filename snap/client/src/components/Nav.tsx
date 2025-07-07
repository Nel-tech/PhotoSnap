'use client'

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, Upload, BookOpen, LogOut, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from 'next/image';

function Nav() {
  const pathname = usePathname();
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);


  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navigation = [
    { name: 'FEATURES', href: '/features' },
    { name: 'PRICING', href: '/pricing' },
    isAuthenticated && { name: 'STORIES', href: '/stories' },
  ].filter(Boolean);

  return (
    <div>
      <nav className="flex items-center justify-between p-4 sm:px-6 lg:px-8 md:justify-around">
        <div className="flex items-center">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image src="/images/shared/desktop/logo.svg" alt="logo" width={150} height={150} />
          </Link>
        </div>
        <div className="flex items-center lg:hidden md:hidden">
          <button
            type="button"
            className="-m-2.5 cursor-pointer  inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden md:flex md:gap-[1rem] lg:flex lg:gap-x-12">
          {navigation
            .filter((item): item is { name: string; href: string } => Boolean(item))
            .map((item) => (
              <Link
                key={item.name}
                href={item.href || '#'}
                className={`text-sm opacity-55 font-semibold leading-6 text-black transition duration-300 
          ${pathname === item.href ? "text-primary underline" : "hover:text-primary hover:underline"}`}
              >
                {item.name}
              </Link>
            ))}
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-[1rem] md:flex md:gap-[1rem]">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md   text-black transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-black" />
                </div>
                <span>Dashboard</span>
                <ChevronDown
                  className={`h-4 w-4 cursor-pointer transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="p-1 divide-y divide-gray-100">
                      <div className="px-2 py-3 bg-gray-50 rounded-t-md">
                        <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/collection"
                          className={`group flex items-center gap-2 px-4 py-2 text-sm ${pathname === "/collection" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <BookOpen
                            className={`h-4 w-4 ${pathname === "/collection" ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"}`}
                          />
                          Collections
                        </Link>
                        <Link
                          href="/profile"
                          className={`group flex items-center gap-2 px-4 py-2 text-sm ${pathname === "/profile" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <User
                            className={`h-4 w-4 ${pathname === "/profile" ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"}`}
                          />
                          Profile
                        </Link>
                        <Link
                          href="/upload-story"
                          className={`group flex items-center gap-2 px-4 py-2 text-sm ${pathname === "/upload-story" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Upload
                            className={`h-4 w-4 ${pathname === "/upload-story" ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"}`}
                          />
                          Upload Story
                        </Link>
                        {/* <Link
                          href="/settings"
                          className={`group flex items-center gap-2 px-4 py-2 text-sm ${pathname === "/settings" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings
                            className={`h-4 w-4 ${pathname === "/settings" ? "text-blue-500" : "text-gray-500 group-hover:text-blue-500"}`}
                          />
                          Settings
                        </Link> */}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false)
                            handleLogout()
                          }}
                          className="group cursor-pointer flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 text-red-500" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link href="/signup" className=" lg:text-base lg:font-semibold lg:leading-6 lg:text-gray-900">
                <Button
                  variant={"outline"}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md"
                >
                  SIGNUP <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>

              <Link href="/login" className="text-base font-semibold leading-6 text-gray-900 ">
                <Button
                  variant={"outline"}
                  className="bg-black text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-800"
                >
                  LOGIN <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <AnimatePresence>
        <Dialog key="mobile-menu" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.9 }}
            className="fixed inset-0 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.9 }}
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
          >
            <Dialog.Panel>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="-m-2.5 cursor-pointer rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-4 py-6">
                    {navigation
                      .filter((item): item is { name: string; href: string } => Boolean(item))
                      .map((item) => (
                        <Link
                          key={item.name}
                          href={item.href || "#"}
                          className={`block text-sm font-semibold leading-6 text-black transition duration-300 
                      ${pathname === item.href ? "text-primary underline" : "hover:text-primary hover:underline"}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                  </div>
                  <div className="py-6">
                    {isAuthenticated ? (
                      <>
                        {/* Bottom navigation for authenticated users */}
                        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-2 z-50">
                          <Link
                            href="/collection"
                            className="flex flex-col items-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <BookOpen className={`h-5 w-5 ${pathname === "/collection" ? "text-blue-500" : ""}`} />
                            <span className="text-xs mt-1">Collections</span>
                          </Link>
                          <Link
                            href="/profile"
                            className="flex flex-col items-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User className={`h-5 w-5 ${pathname === "/profile" ? "text-blue-500" : ""}`} />
                            <span className="text-xs mt-1">Profile</span>
                          </Link>
                          <Link
                            href="/upload-story"
                            className="flex flex-col items-center"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Upload className={`h-5 w-5 ${pathname === "/upload-story" ? "text-blue-500" : ""}`} />
                            <span className="text-xs mt-1">Upload</span>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              setMobileMenuOpen(false)
                              handleLogout()
                            }}
                            className="flex flex-col cursor-pointer items-center text-red-500"
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="text-xs mt-1">Logout</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Link
                          href="/signup"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md"
                          >
                            SIGNUP <span aria-hidden="true">&rarr;</span>
                          </Button>
                        </Link>

                        <Link
                          href="/login"
                          className="block text-sm font-semibold leading-6 text-gray-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="outline"
                            className="w-full bg-black text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-800"
                          >
                            LOGIN <span aria-hidden="true">&rarr;</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </motion.div>
        </Dialog>
      </AnimatePresence>
      {isAuthenticated && (
        <div className="lg:hidden md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-2 z-40">
          <Link href="/collection" className="flex flex-col items-center">
            <BookOpen className={`h-5 w-5 ${pathname === "/collection" ? "text-blue-500" : ""}`} />
            <span className="text-xs mt-1">Collections</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center">
            <User className={`h-5 w-5 ${pathname === "/profile" ? "text-blue-500" : ""}`} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
          <Link href="/upload-story" className="flex flex-col items-center">
            <Upload className={`h-5 w-5 ${pathname === "/upload-story" ? "text-blue-500" : ""}`} />
            <span className="text-xs mt-1">Upload</span>
          </Link>
          <button onClick={handleLogout} className="flex flex-col cursor-pointer items-center text-red-500">
            <LogOut className="h-5 w-5" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      )}


    </div>
  );
}

export default Nav;
