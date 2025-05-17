'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import { handleSave, fetchUserProfile, handlePasswordUpdate } from "../Api/Api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

type Profile = {
  data: {
    user: {
      email: string;
      password?: string;
      name: string;
    };
  };
};

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    passwordConfirm: ''
  });

  const { data, isLoading, error, refetch } = useQuery<Profile, Error>({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
    enabled: !!Cookies.get('token'),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  const { mutate: updateProfile } = useMutation({
    mutationFn: handleSave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const { mutate: updatePassword } = useMutation({
    mutationFn: handlePasswordUpdate,
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update password");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (profileData) {
      setProfileData((prev) => {
        if (prev) {
          return {
            ...prev,
            data: {
              ...prev.data,
              user: {
                ...prev.data.user,
                [name]: value,
              },
            },
          };
        }
        return prev;
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const isPasswordValid = passwordData.currentPassword && passwordData.newPassword && passwordData.passwordConfirm && (passwordData.newPassword === passwordData.passwordConfirm);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading || !isClient) {
    return (
      <section className="max-w-3xl mx-auto py-8 px-4">
        <Skeleton height={40} width="50%" className="mb-4" />
        <Skeleton height={20} width="80%" className="mb-4" />
        <Skeleton height={20} width="80%" className="mb-4" />
        <Skeleton height={20} width="80%" className="mb-4" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-3xl mx-auto py-8 px-4 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-gray-600">We couldn't load your profile. Please try again later.</p>
        <Button onClick={() => refetch()} variant="secondary">Retry</Button>
      </section>
    );
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
                <TabsTrigger value="security">Password</TabsTrigger>
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
                        value={profileData?.data?.user?.name || ""}
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
                        value={profileData?.data?.user?.email || ""}
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2"
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            if (profileData?.data?.user) {
                              updateProfile({
                                name: profileData.data.user.name,
                                email: profileData.data.user.email,
                              });
                              setIsEditing(false);
                            } else {
                              toast.error("No profile data available");
                            }
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            refetch();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Password tab */}
              <TabsContent value="security" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Password Change</CardTitle>
                    <CardDescription>Update your password here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label>Current Password</Label>
                    <Input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />

                    <Label>New Password</Label>
                    <Input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />

                    <Label>Confirm Password</Label>
                    <Input type="password" name="passwordConfirm" value={passwordData.passwordConfirm} onChange={handlePasswordChange} />

                    {!isPasswordValid && <p className="text-red-500">Passwords do not match or fields are empty.</p>}
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => updatePassword(passwordData)} disabled={!isPasswordValid}>Change Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
