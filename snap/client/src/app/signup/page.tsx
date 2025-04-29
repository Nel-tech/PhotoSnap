'use client'
import Nav from "@/components/Nav";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeClosedIcon } from "lucide-react";
//import fetcher from "@/lib/fetcher";
import cookie from "js-cookie";
import axios from "axios";
import { useAuthStore } from '@/store/useAuthStore';
import { AxiosError } from "axios";


type FormData = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
};

export default function SignUp() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
    const [, setServerMessage] = useState("");
    const [passwordVisibility, setPasswordVisibility] = useState({
        password: false,
        passwordConfirm: false,
    });

    const toggleVisibility = (field: "password" | "passwordConfirm") => {
        setPasswordVisibility(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };


    const router = useRouter()
    const login = useAuthStore((state) => state.login);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,isSubmitting },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        console.log("Submitting form...", data);

        setServerMessage("");

        if (data.password !== data.passwordConfirm) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            // Log request data for debugging
            console.log("Request Data:", {
                name: data.name,
                email: data.email,
                password: data.password,
                passwordConfirm: data.passwordConfirm,
            });

            // Send POST request
            const res = await axios.post(`${API_BASE_URL}api/v1/users/signup`, {
                name: data.name,
                email: data.email,
                password: data.password,
                passwordConfirm: data.passwordConfirm,
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            // Log the response data
            console.log("Response:", res.data);

            // Handle the token if available
            if (res.data.token) {
                console.log("Setting token:", res.data.token);
                cookie.set("jwt", res.data.token, { expires: 7, path: "/" });
                login(res.data.token);
            }

            // Handle the response and error
            setServerMessage(res.data.message || "Signup successful");

            // Check the status of the response
            if (res.data.status !== "success") {
                if (res.data.message === "Email already exists") {
                    toast.error("This email is already registered");
                } else {
                    toast.error(res.data.message || "Something went wrong");
                }
                return;
            }

            toast.success("Account Successfully Created");
            router.push("/");
        } catch (error: unknown) {
            const axiosError = error as AxiosError<{ message: string }>;

            if (axiosError.response && axiosError.response.data) {
                const errorMsg = axiosError.response.data.message || "Something went wrong. Please try again.";
                toast.error(errorMsg);

                if (errorMsg === "Email already exists") {
                    toast.error("This email is already registered");
                }
            } else {
                toast.error("Something went wrong. Please try again.");
            }

            console.error("Error:", axiosError);
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
                                disabled={isSubmitting}
                                className={`w-full rounded py-2 text-white transition-colors ${isSubmitting
                                    ? 'bg-indigo-600 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-600'
                                    }`}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>


                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

