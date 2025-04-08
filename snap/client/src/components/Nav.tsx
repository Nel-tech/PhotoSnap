'use client'

import { useState } from 'react';
import { useAuth } from '@/hooks/AuthContext';
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
  const { isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'FEATURES', href: '/features' },
    { name: 'PRICING', href: '/pricing' },
    isAuthenticated && { name: 'STORIES', href: '/stories' },
  ].filter(Boolean);

  return (
    <div>
      <nav className="flex justify-around p-6 lg:px-1" aria-label="Global">
        <div className="flex items-center">
          <Link href="/" className="-m-1.5 p-1.5">
            <img src="/images/shared/desktop/logo.svg" alt="logo" width={150} height={150} />
          </Link>
        </div>
        <div className="flex items-center lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-x-12">
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
        <div className="flex items-center gap-[1rem] justify-end">
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
                  <span>Profile</span>
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
              <Link href="/signup" className="text-base font-semibold leading-6 text-gray-900">
                <Button variant={"outline"} className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md'>
                  SIGNUP <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>

              <Link href="/login" className="text-base font-semibold leading-6 text-gray-900">
                <Button variant={"outline"} className='bg-black text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-800'>
                  LOGIN <span aria-hidden="true">&rarr;</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <img className="h-8 w-auto" src="images/shared/desktop/logo.svg" alt="" />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item?.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  GET AN INVITE
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default Nav;
