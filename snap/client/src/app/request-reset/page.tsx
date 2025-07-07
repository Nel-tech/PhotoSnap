'use client'

import { useHandleRequestToken } from "@/app/hooks/useApp"
import React, { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Copy, Loader2, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

function RequestResetForm() {
    const [email, setEmail] = useState('')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const mutation = useHandleRequestToken()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error("Please enter an email address")
            return
        }

        mutation.mutate({ email }, {
            onSuccess: (data) => {
                if (data?.token) {
                  
                    setIsDialogOpen(true)
                } else if (data?.alreadyExists) {
                    
                    toast.custom(data.message || `A reset token already exists. Please wait ${data.waitTime} minute(s) before requesting a new one.`)
                }
            }
        })
    }

    const handleCopy = () => {
        const token = mutation.data?.token
        if (token) {
            navigator.clipboard.writeText(token)
            toast.success("Token copied to clipboard!")
        }
    }

    const tokenValue = mutation.data?.token || mutation.data?.Token?.token

    return (
      <>
      <header>
        <Nav/>
      </header>

        <div className="max-w-md mx-auto mt-[7rem]">
                <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white  rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Reset Token</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Enter your email address to generate a password reset token.
                    </p>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={mutation.isPending}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || !email.trim()}
                    className="w-full bg-blue-600  text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                    {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    {mutation.isPending ? 'Generating Token...' : 'Generate Reset Token'}
                </button>

                {/* Success State - Show when token is available */}
                {mutation.isSuccess && tokenValue && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">Token Generated Successfully!</span>
                        </div>
                        <p className="text-green-700 text-sm mb-3">
                            Your reset token has been generated. Click the button below to view and copy it.
                        </p>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full cursor-pointer">View Reset Token</Button>
                                </DialogTrigger>

                                <DialogContent className="max-w-md  bg-white dark:bg-gray-900 dark:text-white rounded-lg border-0">
                                    <DialogHeader>
                                        <DialogTitle>Your Reset Token</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Reset Token:
                                            </label>
                                            <div className="relative">
                                                <code className="block break-all bg-gray-50 dark:bg-gray-800 p-3 rounded-md border dark:border-gray-700 text-sm pr-12 font-mono text-gray-900 dark:text-gray-100">
                                                    {tokenValue}
                                                </code>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleCopy}
                                                    className="absolute cursor-pointer top-2 right-2 h-8 w-8"
                                                    title="Copy token"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 rounded-md p-3">
                                            <p className="text-amber-800 dark:text-amber-100 text-xs">
                                                <strong>Important:</strong> This token will expire in 15 minutes.
                                                Copy it now and use it to reset your password.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer section with clean background */}
                                    <div className="mt-6 bg-white dark:bg-gray-800 pt-4 space-y-2">
                                        <Link
                                            href="/reset-password"
                                            className="w-full"
                                            onClick={() => setIsDialogOpen(false)}
                                        >
                                            <Button className="w-full cursor-pointer">Go to Reset Password</Button>
                                        </Link>
                                    </div>


                                </DialogContent>
                            </Dialog>


                    </div>
                )}

                    {mutation.isSuccess && mutation.data?.alreadyExists && (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-amber-600" />
                                <span className="text-amber-800 font-medium">Token Already Exists</span>
                            </div>
                            <p className="text-amber-700 text-sm">
                                {mutation.data.message}
                            </p>
                        </div>
                    )}

                {/* Error State */}
                {mutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-800 text-sm">
                            {mutation.error?.message || 'Failed to generate reset token'}
                        </p>
                    </div>
                )}
            </form>
        </div>

        <footer>
            <Footer/>
        </footer>
         </>

    )
}


export default RequestResetForm