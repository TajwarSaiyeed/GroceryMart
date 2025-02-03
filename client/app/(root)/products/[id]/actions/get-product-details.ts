"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";

export const getProductDetails = async (id: number) => {
  try {
    const product = await axios.get(`${API_URL}/product/products/${id}`);
    return product.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

export const getReviews = async (productId: number) => {
  console.log("Fetching reviews for product", productId);

  return [
    {
      id: 1,
      rating: 5,
      comment: "Great product!",
    },
  ];
};
