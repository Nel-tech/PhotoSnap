'use client'

import Nav from "@/components/Nav";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import Link from "next/link";
import Footer from "@/components/Footer";
import { LoginData } from "../types/typed";
import { Login } from "@/lib/api";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import { handleLoginSuccess } from "@/store/useAuthStore";


export default function SignIn() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>();
    const login = useAuthStore((state) => state.login)
    const router = useRouter();
    const { getAuthUrls, handleAuthSuccess } = useAuthRedirect();
    const { signupUrl } = getAuthUrls();

    
    const onSubmit = async (formData: LoginData) => {
        const { email, password } = formData;

        try {
            const response = await Login({ email, password });

            if (handleLoginSuccess(response, login)) {
                const role = response.data.user.role;
                if (role === "admin") {
                    toast.success("Admin logged in successfully");
                    router.push("/admin");
                } else {
                    toast.success("Login successful");
                    handleAuthSuccess();
                }
            } else {
                toast.error("Login failed: Invalid credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (

        <>

            <header>
                <Nav />
            </header>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register('email', { required: 'Email is required' })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Password
                                </label>
                                <div className="text-sm">
                                    <Link href="/request-reset" className="font-semibold text-blue-600 hover:text-blue-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password', { required: 'Password is required' })}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full  justify-center rounded-md cursor-pointer bg-black px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs  transition-all duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Don&#39;t have an account?{' '}
                        <Link href={signupUrl} className="font-semibold text-blue-600 hover:text-blue-500">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
