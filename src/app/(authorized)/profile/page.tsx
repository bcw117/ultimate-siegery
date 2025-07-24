import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Target, Edit3 } from "lucide-react";
import { getNumLoadouts } from "./actions";

export default async function Profile() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { count } = await getNumLoadouts(user.id);

  // Format the creation date
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  // Get user initials for avatar fallback
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (
      (first + last).toUpperCase() ||
      user.emailAddresses[0]?.emailAddress?.charAt(0).toUpperCase() ||
      "U"
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 relative mt-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Profile
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="shadow-lg border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-700 shadow-lg">
                <AvatarImage
                  src={user.imageUrl}
                  alt={user.firstName || "User"}
                />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username || "User"}
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1 justify-center md:justify-start">
                    <Calendar className="w-4 h-4" />
                    Joined {joinDate}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings" disabled>
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Account Information
                      </CardTitle>
                      <User className="w-4 h-4 ml-auto text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Username
                          </p>
                          <p className="text-sm font-medium">
                            {user.username || "Not set"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            First Name
                          </p>
                          <p className="text-sm font-medium">
                            {user.firstName || "Not set"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Last Name
                          </p>
                          <p className="text-sm font-medium">
                            {user.lastName || "Not set"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <div className="text-sm flex items-center gap-1 justify-center md:justify-start">
                            {user.emailAddresses[0]?.emailAddress}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-1">
                    <Card>
                      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium mr-2">
                          Loadouts Created
                        </CardTitle>
                        <Target className="w-4 h-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <h1 className="text-2xl font-bold">{count}</h1>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>
                        Customize your experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about your account
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Privacy Settings</p>
                          <p className="text-sm text-muted-foreground">
                            Control who can see your profile
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Data Export</p>
                          <p className="text-sm text-muted-foreground">
                            Download your account data
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 dark:border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-600 dark:text-red-400">
                        Danger Zone
                      </CardTitle>
                      <CardDescription>
                        Irreversible and destructive actions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
