"use server";
import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios from "axios";

export const getWishlists = async () => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }
    const response = await axios.get(`${API_URL}/customer/wishlist/`, {
      headers: {
        Authorization: `Token ${session.user?.token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Wishlist error:", error);
  }
};
