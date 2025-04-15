"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";

export async function getTopRatedProducts() {
  try {
    const res = await axios.get(`${API_URL}/product/top-rated-products/`);
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return { results: []};
  }
}
