"use server";
import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios from "axios";
import { revalidatePath } from "next/cache";

export const addToWishList = async (productId: number) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const response = await axios.post(
      `${API_URL}/customer/wishlist/`,
      {
        product: productId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${session.user?.token}`,
        },
      }
    );

    revalidatePath("/user/wishlist");

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add product to wishlist");
  } finally {
    revalidatePath("/products");
  }
};

export const deleteFromWishlist = async (wishlistProductId: number) => {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }

    const response = await axios.delete(
      `${API_URL}/customer/wishlist/${wishlistProductId}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${session.user?.token}`,
        },
      }
    );

    revalidatePath("/user/wishlist");

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add product to wishlist");
  } finally {
    revalidatePath("/products");
  }
};
