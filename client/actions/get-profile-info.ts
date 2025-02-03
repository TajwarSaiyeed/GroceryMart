"use server";
import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios from "axios";

export const getProfileInfo = async () => {
  const session = await auth();
  
  if (!session) {
    throw new Error("Not authenticated");
  }

  const response = await axios.get(`${API_URL}/customer/profile/`, {
    headers: {
      Authorization: `Token ${session?.user?.token}`,
    },
  });

  console.log(response.data);

  return response.data;
};
