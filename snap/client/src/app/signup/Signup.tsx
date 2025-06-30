'use client'
import Nav from "@/components/Nav";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
import { useAuthStore } from '@/store/useAuthStore';
import Footer from "@/components/Footer";
import { Signup } from "@/lib/api"
import { validateEmailClient } from "@/components/ValidateEmail";
import { SignupData } from "../types/typed";
import { useAuthRedirect } from "../hooks/useAuthRedirect";


export default function SignUpPage() {
    const [, setIsLoading] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        passwordConfirm: false,
    });
    const login = useAuthStore((state) => state.login)

    const toggleVisibility = (field: "password" | "passwordConfirm") => {
        setPasswordVisibility(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };
    const { getAuthUrls, handleAuthSuccess } = useAuthRedirect();
    const { loginUrl } = getAuthUrls();


    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignupData>();

    const onSubmit = async (formData: SignupData) => {
        setIsLoading(true);

        const { name, email, password, passwordConfirm } = formData;

        try {
            // Email validation
            if (email.trim()) {
                const validation = validateEmailClient(email);
                if (!validation.isValid) {
                    toast.error(validation.message);
                    setIsLoading(false); 
                    return;
                }
            }

        
const response = await Signup({
    name,
    email,
    password,
    passwordConfirm
});

if (!response || response.status !== "success") {
    const errorMessage = response?.message || "Signup failed";
    toast.error(errorMessage);
    return;
}

const userData = response.data?.user || response.user || response;

if (!userData || !userData._id) {
    toast.error("Signup failed: No user data received");
    return;
}

const user = {
    _id: userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role || 'user'
};

if (!user._id || !user.email) {
    toast.error("Signup failed: Invalid user data");
    return;
}


login(user, response.token); 


toast.success("Account created successfully! Welcome aboard!");
handleAuthSuccess()

        } catch (err: any) {
            console.error("Signup error:", err);

            let message = "Something went wrong";

            if (err.response?.status === 409 || err.response?.status === 400) {
                const errorMessage = err.response?.data?.message || "";
                if (errorMessage.toLowerCase().includes('email') &&
                    (errorMessage.toLowerCase().includes('exist') ||
                        errorMessage.toLowerCase().includes('taken') ||
                        errorMessage.toLowerCase().includes('registered'))) {
                    message = "An account with this email already exists. Please use a different email or try signing in.";
                } else {
                    message = errorMessage || "Invalid registration details";
                }
            } else if (err.response?.data?.message) {
                message = err.response.data.message;
            } else if (err.message) {
                message = err.message;
            }

            toast.error(message);

        } finally {
            setIsLoading(false);
        }
    };



    const password = watch("password");

    return (
        <>
            <header>
                <Nav />
            </header>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Create an account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                Name
                            </label>
                            <div className="mt-2">
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    id="name"
                                    type="text"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Enter a valid email",
                                        },
                                    })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Password */}
                        <div className='relative'>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    type={passwordVisibility.password ? 'text' : 'password'}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className=" relative block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("password")}
                                    className="absolute right-3 top-1/4 text-black"
                                >
                                    {passwordVisibility.password ? (
                                        < EyeClosedIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="passwordConfirm" className="block text-sm/6 font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type={passwordVisibility.passwordConfirm ? 'text' : 'password'}
                                    {...register("passwordConfirm", {
                                        required: "Please confirm your password",
                                        validate: value =>
                                            value === password || "Passwords do not match",
                                    })}
                                    className="relative block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggleVisibility("passwordConfirm")}
                                    className="absolute right-3 top-1/4 text-black"
                                >
                                    {passwordVisibility.passwordConfirm ? (
                                        < EyeClosedIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                                {errors.passwordConfirm && <p className="text-red-500 text-sm">{errors.passwordConfirm.message}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md cursor-pointer bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs  transition-all duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating...' : 'Create Account'}
                            </button>
                        </div>


                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have an account?{" "}
                        <Link href={loginUrl} className="font-semibold text-blue-600 hover:text-blue-500">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </>
    );
}

