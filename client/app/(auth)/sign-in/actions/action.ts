"use server";
import axios from "axios";
import { signIn } from "@/auth";
import { API_URL } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function authenticateUser(username: string, password: string) {
  try {
    const { data } = await axios.post(
      `${API_URL}/customer/login/`,
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (data.error) {
      return { error: data.error };
    }

    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    revalidatePath("/");
    return result;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        error:
          error.response.data.error ||
          "Something went wrong. Please try again.",
      };
    } else {
      return {
        error: "Something went wrong. Please try again.",
      };
    }
  }
}
