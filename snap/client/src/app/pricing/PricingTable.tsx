'use client'
// import { useState } from "react"
// import { Label } from "@/components/ui/label"
import { Fragment } from "react"

export default function PricingTable() {
    // const [enabled, setEnabled] = useState(false);
    // const [disabled, setDisabled] = useState(true); // State to control the disabled state
    // const [price, setPrice] = useState({
    //     BasicPrice: '500.00',
    //     PremiumPrice: '1000.00',
    //     BusinessPrice: '2000.00'
    // });

    // // Update price based on the toggle state
    // function TogglePrice() {
    //     if (!enabled) {
    //         setPrice({ BasicPrice: '1500.00', PremiumPrice: '3000.00', BusinessPrice: '4500.00' });
    //     } else {
    //         setPrice({ BasicPrice: '500.00', PremiumPrice: '1000.00', BusinessPrice: '2000.00' });
    //     }
    // }

    // // Trigger the price update when the toggle state changes
    // const handleToggleChange = () => {
    //     if (!disabled) {
    //         setEnabled(!enabled);
    //         TogglePrice();
    //     }
    // };

    return (
        <Fragment>
            <div className="mt-[10rem]">
                {/* <div className="flex items-center space-x-4 justify-center mb-10">
                    <Label htmlFor="monthly" className="text-xl">Monthly</Label>
                    <div
                        className={`relative w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        onClick={handleToggleChange}
                    >
                        <div
                            className={`w-5 h-5 bg-black rounded-full shadow-md transform transition ${enabled ? "translate-x-6" : "translate-x-0"}`}
                        ></div>
                    </div>
                    <Label htmlFor="yearly" className="text-xl">Yearly</Label>
                </div> */}

                <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-[1rem] max-w-5xl mx-auto lg:flex lg:flex-row lg:justify-center lg:items-stretch lg:max-w-5xl">
                    {/* Basic Plan */}
                    <div className="bg-gray-100 w-[17rem] h-[75vh] flex flex-col mx-auto items-center text-center mt-[2rem] pt-[3rem]">
                        <h2 className="text-2xl font-bold mb-4">Basic</h2>
                        <p className="text-gray-600 mb-8 max-w-[15rem] text-sm">
                            Includes basic usage of our platform. Recommended for new and aspiring photographers.
                        </p>
                        <div>
                            {/* <div className="text-4xl font-bold mb-1">#{price.BasicPrice}</div>
                            <div className="text-gray-500 mb-8">{enabled ? 'per year' : 'per month'}</div> */}
                            <button disabled className="bg-black text-white py-3 px-8 font-medium w-full cursor-not-allowed">COMING SOON</button>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="hidden absolute top-0 left-[36.8%] w-[17rem] h-[0.3rem] bg-gradient-to-r from-orange-300 via-pink-500 to-blue-500 md:hidden lg:block"></div>
                    <div className="bg-black text-white w-[17rem] h-[90vh] flex flex-col items-center text-center mx-auto pt-[2rem]">
                        <h2 className="text-2xl font-bold mb-4">Pro</h2>
                        <p className="text-gray-300 mb-8 max-w-[15rem] text-sm">
                            More advanced features available. Recommended for photography veterans and professionals.
                        </p>
                        <div>
                            {/* <div className="text-4xl font-bold mb-1">#{price.PremiumPrice}</div>
                            <div className="text-gray-300 mb-8">{enabled ? 'per year' : 'per month'}</div> */}
                            <button disabled className="bg-white text-black py-3 px-8 font-medium w-full cursor-not-allowed">COMING SOON</button>
                        </div>
                    </div>

                    {/* Business Plan */}
                    <div className="bg-gray-100 w-[17rem] h-[75vh] mx-auto flex flex-col items-center text-center mt-[2rem] pt-[3rem]">
                        <h2 className="text-2xl font-bold mb-4">Business</h2>
                        <p className="text-gray-600 mb-8 max-w-[15rem] text-sm">
                            Additional features available such as more detailed metrics. Recommended for business owners.
                        </p>
                        <div>
                            {/* <div className="text-4xl font-bold mb-1">#{price.BusinessPrice}</div> */}
                            {/* <div className="text-gray-500 mb-8">{enabled ? 'per year' : 'per month'}</div> */}
                            <button disabled className="bg-black text-white py-3 px-8 font-medium w-full cursor-not-allowed">COMING SOON</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
