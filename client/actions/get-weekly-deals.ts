"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";

export async function getFilteredWeeklyDeals() {
  try {
    const res = await axios.get(`${API_URL}/product/weekly-deal-products/`, {
      params: {
        weekly_deal: true,
      },
    });
    return res.data.results || [];
  } catch {
    return { results: [] };
  }
}


export async function getWeeklyDeals(page = 1) {
  try {
    const res = await axios.get(
      `${API_URL}/product/weekly-deal-products/?page=${page}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching weekly deals:", error);
    return { results: [], count: 0, next: null, previous: null };
  }
}
