'use client'
import React, { useState } from "react"
import { useHandleResetPassword } from "@/app/hooks/useApp"
import { useRouter } from "next/navigation"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"

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
                    router.push('/login')
                }
            }
        )
    }

    return (

        <>
        <header>
            <Nav/>
        </header>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded w-full max-w-sm">
          <h2 className="text-lg font-medium text-center">Reset Your Password</h2>
  
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
              className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
              Reset Password
          </button>
      </form>
  </div>

  <footer>
    <Footer/>
  </footer>
        </>
      
      

    )
}

export default ResetPasswordForm
