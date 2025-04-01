'use client'
import { useState } from 'react'
import { Menu, X } from "lucide-react"
import Link from 'next/link'
import { Dialog } from '@headlessui/react'
import Image from 'next/image'
import Logo from '@/images/shared/desktop/logo.svg'
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
function Nav() {

const navigation = [
  //{ name: 'STORIES', href: '/stories' },
  { name: 'FEATURES',href: '/features' },
  { name: 'PRICING', href: '/pricing' },
]

const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div >
     
       <nav className="flex justify-around p-6 lg:px-1" aria-label="Global">
       <div className="flex items-center"> {/* Add items-center to vertically center items */}
         <Link href="/" className="-m-1.5 p-1.5">
         <Image src={Logo} alt="logo" width={150} height={150} />
          
         </Link>
       </div>
       <div className="flex items-center lg:hidden"> {/* Add items-center */}
         <button
           type="button"
           className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
           onClick={() => setMobileMenuOpen(true)}
         >
           <Menu className="h-6 w-6" aria-hidden="true" />
         </button>
       </div>
       <div className="flex items-center gap-x-12"> {/* Add items-center and gap-x */}
         {navigation.map((item) => (
          <Link
  key={item.name}
  href={item.href}
  className={`text-base font-semibold leading-6 text-black transition duration-300 
    ${pathname === item.href ? "text-primary underline" : "hover:text-primary hover:underline"}
  `}
>
  {item.name}
</Link>

         ))}
       </div>
       <div className="flex items-center gap-[1rem] justify-end"> {/* Add items-center and justify-end */}
         <Link href="#" className="text-base font-semibold leading-6 text-gray-900">
         <Button variant={"outline"} className='cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md'>
            SIGNUP <span aria-hidden="true">&rarr;</span>
         </Button>
         </Link>

          <Link href="#" className="text-base font-semibold leading-6 text-gray-900">
         <Button variant={"outline"} className='bg-black text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-gray-800'>
            LOGIN <span aria-hidden="true">&rarr;</span>
         </Button>
         </Link>
       </div>
     </nav>
     
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
               
                <img
                className="h-8 w-auto"
                src="images/shared/desktop/logo.svg"
                alt=""
              />
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
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-lg font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
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
  )

}

export default Nav