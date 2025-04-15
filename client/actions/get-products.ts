"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";

export async function getProducts(category_id?: number, page: number = 1) {
  try {
    const res = await axios.get(`${API_URL}/product/products/`, {
      params: {
        category_id: category_id || "",
        page,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { results: [], count: 0, next: null, previous: null };
  }
}
