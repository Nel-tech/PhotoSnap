'use client'
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Nav from "@/components/Nav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Footer from "@/components/Footer";
import { Profile } from "../types/typed";
import { useProfile, useProfileUpdate } from "../hooks/useApp";




export default function ProfilePage() {


  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  

  const { data, isLoading, error, refetch } = useProfile() 

  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  const { mutate: updateProfile } = useProfileUpdate()


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


  if (isLoading) {
    return (
      <section className="max-w-xl mx-auto py-8 px-4">
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-2/3 bg-gray-300 rounded" />
          <div className="h-6 w-1/2 bg-gray-200 rounded" />
        </div>
      </section>
    );
  }


  if (error) {
    return (
      <section className="max-w-3xl mx-auto py-8 px-4 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-gray-600">We couldn&apos;t load your profile. Please try again later.</p>

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

             
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
}
