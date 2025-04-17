'use client'

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Menu, X } from "lucide-react";
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import { User, Bookmark, Upload, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function Nav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const navigation = [
    { name: 'FEATURES', href: '/features' },
    { name: 'PRICING', href: '/pricing' },
    isAuthenticated && { name: 'STORIES', href: '/stories' },
  ].filter(Boolean);

  return (
    <div>
      <nav className="flex items-center justify-between p-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="-m-1.5 p-1.5">
            <img src="/images/shared/desktop/logo.svg" alt="logo" width={150} height={150} />
          </Link>
        </div>
        <div className="flex items-center lg:hidden md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item?.name}
              href={item?.href || '#'}
              className={`text-sm opacity-55 font-semibold leading-6 text-black transition duration-300 
                ${pathname === item?.href ? "text-primary underline" : "hover:text-primary hover:underline"}`}
            >
              {item?.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:items-center lg:gap-[1rem]">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/profile">
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Bookmarks</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Upload Story</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Button onClick={logout}>Logout</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/signup" className="lg:text-base lg:font-semibold lg:leading-6 lg:text-gray-900">
                <Button variant={"outline"} className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md'>
                  SIGNUP <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>

              <Link href="/login" className="text-base font-semibold leading-6 text-gray-900 ">
                <Button variant={"outline"} className='bg-black text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-800'>
                  LOGIN <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden md:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">

            <button
              type="button"
              className="md:hidden lg:hidden -m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item?.name}
                    href={item?.href || '#'}
                    className={`text-lg block font-semibold leading-6 text-black transition duration-300 
                ${pathname === item?.href ? "text-primary underline" : "hover:text-primary hover:underline"}`}
            >
                  
                    {item?.name}
                  </a>
                ))}
              </div>
              <div className="flex flex-col  gap-2 sm:flex-row   sm:items-start lg:flex lg:items-center lg:gap-[1rem] lg:justify-end">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <Link href="/profile">
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bookmark className="mr-2 h-4 w-4" />
                        <span>Bookmarks</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Story</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <Button onClick={logout}>Logout</Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                    <div className="flex flex-col gap-2 mt-4 sm:mt-[3rem] sm:pt-[5rem] sm:flex-row sm:items-start">
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md"
                      >
                        SIGNUP <span aria-hidden="true">&rarr;</span>
                      </Button>
                    </Link>

                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="bg-black text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-800"
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
      </Dialog>
    </div>
  );
}

export default Nav;
