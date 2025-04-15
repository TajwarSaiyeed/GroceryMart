"use server";

import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios, { AxiosError } from "axios";

export interface CartState {
  items: {
    id: number;
    quantity: number;
  }[];
}

export const placeOrder = async (cart: CartState) => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const payload = {
      order_items: cart.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    const response = await axios.post(`${API_URL}/product/orders/`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session.user?.token}`,
      },
    });

    return {
      success: true,
      message: "Order placed successfully",
      data: response.data,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        (error as AxiosError<{ message: string }>)?.response?.data?.message ||
        "An error occurred while placing the order",
    };
  }
};
