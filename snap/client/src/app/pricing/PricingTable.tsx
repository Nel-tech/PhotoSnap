'use client'
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Fragment } from "react"

export default function PricingTable() {
    const [enabled, setEnabled] = useState(false);
    const [price, setPrice] = useState({ BasicPrice: '19.00', PremiumPrice: '39.00', BusinessPrice: '99.00' })

    // Update price based on the toggle state
    function TogglePrice() {
        if (!enabled) {
            setPrice({ BasicPrice: '190.00', PremiumPrice: '390.00', BusinessPrice: '990.00' })
        } else {
            setPrice({ BasicPrice: '19.00', PremiumPrice: '39.00', BusinessPrice: '99.00' })
        }
    }

    // Trigger the price update when the toggle state changes
    const handleToggleChange = () => {
        setEnabled(!enabled);
        TogglePrice();
    };

    return (
        <Fragment>
            <div className="mt-[10rem]">
                <div className="flex items-center space-x-4 justify-center mb-10">
                    <Label htmlFor="monthly" className="text-xl">Monthly</Label>
                    <div
                        className={`relative w-12 h-6 flex items-center bg-gray-300  rounded-full p-1 cursor-pointer transition`}
                        onClick={handleToggleChange}  // Update state and price when clicked
                    >
                        <div
                            className={`w-5 h-5 bg-black rounded-full shadow-md transform transition ${enabled ? "translate-x-6" : "translate-x-0"}`}
                        ></div>
                    </div>
                    <Label htmlFor="yearly" className="text-xl">Yearly</Label>
                </div>

                <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-[1rem] max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-gray-100 w-[17rem] h-[75vh] flex flex-col items-center text-center mt-[2rem] pt-[3rem]">
                        <h2 className="text-2xl font-bold mb-4">Basic</h2>
                        <p className="text-gray-600 mb-8 max-w-[15rem] text-sm">
                            Includes basic usage of our platform. Recommended for new and aspiring photographers.
                        </p>
                        <div className="">
                            <div className="text-4xl font-bold mb-1">${price.BasicPrice}</div> {/* Display dynamic price */}
                            <div className="text-gray-500 mb-8">{enabled ? 'per year' : 'per month'}</div> {/* Switch between monthly and yearly */}
                            <button className="bg-black text-white py-3 px-8 font-medium w-full">PICK PLAN</button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="absolute top-0 left-[36.8%] w-[17rem] h-[0.3rem] bg-gradient-to-r from-orange-300 via-pink-500 to-blue-500"></div>
                    <div className="bg-black text-white w-[17rem] h-[90vh] flex flex-col items-center text-center pt-[2rem]">
                        <h2 className="text-2xl font-bold mb-4">Pro</h2>
                        <p className="text-gray-300 mb-8 max-w-[15rem] text-sm">
                            More advanced features available. Recommended for photography veterans and professionals.
                        </p>
                        <div className="">
                            <div className="text-4xl font-bold mb-1">${price.PremiumPrice}</div> {/* Display dynamic price */}
                            <div className="text-gray-300 mb-8">{enabled ? 'per year' : 'per month'}</div>
                            <button className="bg-white text-black py-3 px-8 font-medium w-full">PICK PLAN</button>
                        </div>
                    </div>

                    {/* Business Plan */}
                    <div className="bg-gray-100 w-[17rem] h-[75vh] flex flex-col items-center text-center mt-[2rem] pt-[3rem]">
                        <h2 className="text-2xl font-bold mb-4">Business</h2>
                        <p className="text-gray-600 mb-8 max-w-[15rem] text-sm">
                            Additional features available such as more detailed metrics. Recommended for business owners.
                        </p>
                        <div className="">
                            <div className="text-4xl font-bold mb-1">${price.BusinessPrice}</div> {/* Display dynamic price */}
                            <div className="text-gray-500 mb-8">{enabled ? 'per year' : 'per month'}</div>
                            <button className="bg-black text-white py-3 px-8 font-medium w-full">PICK PLAN</button>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}
