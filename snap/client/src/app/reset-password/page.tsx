'use client'
import React, { useState } from "react"
import { useHandleResetPassword } from "@/app/hooks/useApp"
import { useRouter } from "next/navigation"

function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState('')
    const [resetToken, setResetToken] = useState('')
    const mutation = useHandleResetPassword()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        mutation.mutate(
            { newPassword, resetToken },
            {
                onSuccess: () => {
                    router.push('/auth/login')
                }
            }
        )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <h2 className="text-lg font-medium">Reset Your Password</h2>

                <input
                    type="text"
                    placeholder="Enter your reset token"
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="border p-2 w-full rounded"
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Reset Password
                </button>
            </form>
        </div>
    )
}

export default ResetPasswordForm
