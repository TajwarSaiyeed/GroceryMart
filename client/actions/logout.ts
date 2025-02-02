"use server";
import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios from "axios";

export const logout = async () => {
  try {
    const session = await auth();

    const result = await axios.get(`${API_URL}/customer/logout/`, {
      headers: {
        Authorization: `Token ${session?.user?.token}`,
      },
    });

    return result.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
