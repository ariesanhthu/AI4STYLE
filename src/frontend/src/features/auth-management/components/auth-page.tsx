"use client";

import { useState } from "react";
import { AuthLayout } from "./auth-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <AuthLayout>
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="space-y-4 pb-4">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "login" | "register")} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100">
              <TabsTrigger 
                value="login" 
                className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="text-base font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === "login" ? (
            <>
              <CardTitle className="text-2xl text-center">Chào mừng trở lại</CardTitle>
              <CardDescription className="text-center">
                Đăng nhập để tiếp tục mua sắm
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl text-center">Tạo tài khoản mới</CardTitle>
              <CardDescription className="text-center">
                Đăng ký để trải nghiệm mua sắm thông minh
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="pt-2">
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
