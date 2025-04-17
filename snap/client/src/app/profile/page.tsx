"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Lock } from "lucide-react"
import toast from "react-hot-toast"
import { useAuthStore } from '@/store/useAuthStore';
import Nav from "@/components/Nav"

type Profile = {
  name: string;
  email: string;
  password: string;
}

export default function ProfilePage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        password: ''
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1]
      const response = await fetch(`${API_BASE_URL}/api/v1/users/updateMe`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (profileData) {
      setProfileData(prev => prev ? { ...prev, [name]: value } : null)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('jwt='))?.split('=')[1]
      const response = await fetch(`${API_BASE_URL}/api/v1/users/updatePassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update password')
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast.success('Password updated successfully')
    } catch (error) {
      console.error('Failed to update password:', error)
      toast.error('Failed to update password')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <section>
      <header>
        <Nav />
      </header>

      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Personal Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData?.name || ""}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData?.email || ""}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Current Password
                      </Label>
                      <Input
                        id="current-password"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="border rounded-md px-3 py-2"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="border rounded-md px-3 py-2"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="border rounded-md px-3 py-2"
                        placeholder="••••••••"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handlePasswordUpdate}>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
