"use server";
import { API_URL } from "@/lib/utils";
import axios from "axios";

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/product/categories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
