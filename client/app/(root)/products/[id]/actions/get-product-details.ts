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
  try {
    const reviews = await axios.get(
      `${API_URL}/product/reviews/?product_id=${productId}`
    );
    return reviews.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return null;
  }
};
