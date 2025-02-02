"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";

export async function activateAccount(uid: string, token: string) {
  try {
    const response = await axios.get(
      `${API_URL}/customer/activate/${uid}/${token}/`
    );

    if (response.status === 200) {
      return { success: true, message: "Account successfully activated" };
    } else {
      return {
        success: false,
        message: "Activation link is invalid or expired",
      };
    }
  } catch {
    return { success: false, message: "An error occurred during activation" };
  }
}
