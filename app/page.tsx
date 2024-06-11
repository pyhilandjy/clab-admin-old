"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@chakra-ui/next-js";
import { Box } from "@chakra-ui/react";
import axios from "axios";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const backendUrl = process.env.BACKEND_URL;

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        router.push("/login");
      }
    };

    checkLogin();
  }, [router]);

  if (!isLoggedIn) {
    return;
  }

  return (
    <Box>
      <Link
        href="/edit"
        color="blue.400"
        _hover={{ color: "blue.500" }}
        display="block"
        mb={4}
      >
        Edit
      </Link>
      <Link
        href="/report"
        color="blue.400"
        _hover={{ color: "blue.500" }}
        display="block"
      >
        Report
      </Link>
    </Box>
  );
}
