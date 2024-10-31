"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));

    const redirect = () => {
      if (token) {
        router.replace("/tasks"); // Use replace to prevent going back
      } else {
        router.replace("/auth/login");
      }
      setLoading(false); // Set loading to false after redirect logic
    };

    redirect(); // Call redirect function
  }, [router]);

  return loading ? <div>Loading...</div> : null; // Display loading state
};

export default HomePage;
