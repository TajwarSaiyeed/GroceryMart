"use server";
import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios from "axios";

export const getProfileInfo = async () => {
  const session = await auth();

  if (!session) {
    throw new Error("Not authenticated");
  }
  
  try {
    const response = await axios.get(`${API_URL}/customer/profile/`, {
      headers: {
        Authorization: `Token ${session?.user?.token}`,
      },
    });

    return response.data;
  } catch {
    throw new Error("Failed to fetch profile information");
  }
};
