"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/layout/ProfileHeader";
import { Footer } from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockOrders = [
  {
    id: "ORD-001",
    date: "2025-11-10",
    total: 159.97,
    status: "Delivered",
    items: [
      { name: "Classic White T-Shirt", quantity: 2, price: 29.99 },
      { name: "Denim Jacket Premium", quantity: 1, price: 89.99 },
    ],
  },
  {
    id: "ORD-002",
    date: "2025-11-08",
    total: 69.99,
    status: "Shipping",
    items: [
      { name: "Summer Floral Dress", quantity: 1, price: 69.99 },
    ],
  },
  {
    id: "ORD-003",
    date: "2025-11-05",
    total: 179.98,
    status: "Processing",
    items: [
      { name: "Leather Ankle Boots", quantity: 1, price: 129.99 },
      { name: "Oversized Hoodie Gray", quantity: 1, price: 49.99 },
    ],
  },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipping":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <ProfileHeader />

        <main className="flex-1 py-8 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-2 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">{user?.name || "User"}</h2>
                  <p className="text-sm text-gray-500">Member since 2025</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                  <button 
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Full Name</label>
                    <p className="text-base font-semibold text-gray-900">{user?.name || "Not provided"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Email Address</label>
                    <p className="text-base font-semibold text-gray-900">{user?.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">Phone Number</label>
                    <p className="text-base font-semibold text-gray-900">+84 123 456 789</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">User ID</label>
                    <p className="text-base font-mono text-sm text-gray-700">{user?.id}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-500 block mb-1">Address</label>
                    <p className="text-base font-semibold text-gray-900">123 Nguyen Hue Street, District 1, Ho Chi Minh City</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order History</h3>

              <Tabs defaultValue="order" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="order" className="px-6">
                    Order
                  </TabsTrigger>
                  <TabsTrigger value="status" className="px-6">
                    Status
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="order" className="space-y-4">
                  {mockOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.id}</h4>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-2 mb-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total: ${order.total.toFixed(2)}</span>
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                  {["Delivered", "Shipping", "Processing", "Cancelled"].map((status) => {
                    const ordersInStatus = mockOrders.filter((o) => o.status === status);
                    return (
                      <div key={status} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">{status}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                            {ordersInStatus.length} orders
                          </span>
                        </div>
                        <div className="space-y-2">
                          {ordersInStatus.map((order) => (
                            <div key={order.id} className="flex justify-between text-sm py-2 border-b last:border-0">
                              <span className="text-gray-700">{order.id}</span>
                              <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </RequireAuth>
  );
}
