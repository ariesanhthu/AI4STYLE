"use client";

import { RequireAuth, useAuth } from "@/features/auth-management";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileForm } from "./profile-form";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 bg-muted/30">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Sidebar - Avatar */}
              <div className="md:col-span-3">
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-24 w-24 bg-primary">
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {user?.name || "User"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Content Area - Profile Form */}
              <div className="md:col-span-9">
                <ProfileForm />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </RequireAuth>
  );
}
