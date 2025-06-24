'use client'

import { useHandleRequestToken } from "@/app/hooks/useApp"
import React, { useState } from "react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Copy, Loader2, CheckCircle } from "lucide-react"
import toast from "react-hot-toast"

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
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg border shadow-sm">
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
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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
                                <Button className="w-full">View Reset Token</Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Your Reset Token</DialogTitle>
                                    <DialogDescription>
                                        Copy this token to reset your password. This token expires in 15 minutes.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Reset Token:
                                        </label>
                                        <div className="relative">
                                            <code className="block break-all bg-gray-50 p-3 rounded-md border text-sm pr-12 font-mono">
                                                {tokenValue}
                                            </code>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleCopy}
                                                className="absolute top-2 right-2 h-8 w-8"
                                                title="Copy token"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                                        <p className="text-amber-800 text-xs">
                                            <strong>Important:</strong> This token will expire in 15 minutes.
                                            Copy it now and use it to reset your password.
                                        </p>
                                    </div>
                                </div>

                                <DialogFooter className="flex-col gap-2">
                                    <Link
                                        href="/reset-password"
                                        className="w-full"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        <Button className="w-full">
                                            Go to Reset Password
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
    )
}

export default RequestResetForm