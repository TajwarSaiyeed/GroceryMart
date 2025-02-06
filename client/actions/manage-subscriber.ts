"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";

export async function manageSubscriber(email: string) {
  try {
    const response = await axios.post(
      `${API_URL}/customer/newsletter/`,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch  {
    return { status: 500 };
  }
}
