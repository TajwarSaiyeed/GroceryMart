"use server";

import { signIn } from "@/auth";
import { revalidatePath } from "next/cache";

export async function authenticateUser(username: string, password: string) {
  try {
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    revalidatePath("/");
    return result;
  } catch (error) {
    console.log("Error in authenticateUser:", error);
    return { error: "An error occurred during authentication." };
  }
}
