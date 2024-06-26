

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from "react-router-dom";
function Nav() {
 

const navigation = [
  { name: 'STORIES', href: '/stories' },
  { name: 'FEATURES',href: '/features' },
  { name: 'PRICING', href: '/pricing' },
 
]


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div >
     
       <nav className="flex justify-around p-6 lg:px-8" aria-label="Global">
       <div className="flex items-center"> {/* Add items-center to vertically center items */}
         <Link to="/home" className="-m-1.5 p-1.5">
           <img
             className="w-logoWidth:"
             src="images/shared/desktop/logo.svg"
             alt=""
           />
         </Link>
       </div>
       <div className="flex items-center lg:hidden"> {/* Add items-center */}
         <button
           type="button"
           className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
           onClick={() => setMobileMenuOpen(true)}
         >
           <Bars3Icon className="h-6 w-6" aria-hidden="true" />
         </button>
       </div>
       <div className="flex items-center gap-x-12"> {/* Add items-center and gap-x */}
         {navigation.map((item) => (
           <Link key={item.name} to={item.href} className="text-base font-semibold leading-6 text-gray-900">
             {item.name}
           </Link>
         ))}
       </div>
       <div className="flex items-center justify-end"> {/* Add items-center and justify-end */}
         <a href="#" className="text-base font-semibold leading-6 text-gray-900">
           GET AN INVITE <span aria-hidden="true">&rarr;</span>
         </a>
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
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
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