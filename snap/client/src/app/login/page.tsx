'use client'

import Nav from "@/components/Nav";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import Link from "next/link";


type FormData = {
    email: string;
    password: string;
};

export default function SignIn() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    //  const user = useAuthStore((state) => state.user);
    


    const onSubmit = async (data: FormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}api/v1/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            });

            const resData = await response.json();

            if (!response.ok) {

                if (response.status === 401 || (resData.message && resData.message.toLowerCase().includes('incorrect'))) {
                    toast.error('Incorrect email or password.', {
                        duration: 4000 
                    });
                } else {
                    toast.error(resData.message || 'Login failed', {
                        duration: 4000
                    });
                }
                return;
            }
           if (resData.token) {
    await login(resData.token); 

    const role = useAuthStore.getState().user?.role;
   
    if (role === 'admin') {
        toast.success('Admin Logged-In successfully');
        router.push('/admin');
    } else {
        toast.success('Login successful');
        router.push('/');
    }
}

        } catch (error) {
            toast.error('Something went wrong. Please try again.');
            return error;
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
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
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
                                className="flex w-full justify-center rounded-md cursor-pointer bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Don&#39;t have an account?{' '}
                        <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
