'use client';

import React, { useEffect } from "react";
import { healthBackendService } from "./health-backend.service";


export default function TestHealthBackend() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [success, setSuccess] = React.useState<boolean | null>(null);
  useEffect (() => {
    healthBackendService.getHealthStatus()
      .then(data => {
        console.log('Health Check:', data);
        setSuccess(data.success);
      })
      .catch(error => {
        console.error('Error fetching health data:', error);
      });
  }, [BACKEND_URL]);


  return (
    <main className="container mx-auto py-10 px-4">
      <div> 
        {success === null ? (
          <p>Đang kiểm tra trạng thái sức khỏe của backend...</p>
        ) : success ? (
          <p className="text-green-600 font-semibold">Backend hoạt động tốt!</p>
        ) : (
          <p className="text-red-600 font-semibold">Backend gặp sự cố!</p>
        )}
      </div>  
    </main>
  );
}
