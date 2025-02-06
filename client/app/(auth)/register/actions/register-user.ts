"use server";
import { FormValues } from "../page";
import axios from "axios";
import { API_URL } from "@/lib/utils";

export const extractError = async (error: unknown): Promise<string> => {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data.errors;
    if (errorData && typeof errorData === "object") {
      const errorMessages: string[] = [];
      Object.values(errorData).forEach((messages) => {
        errorMessages.push(
          ...(messages as string[]).map((msg) => msg.toString())
        );
      });
      return errorMessages.join(" ");
    }
  }
  return "An unexpected error occurred.";
};

export const registerUser = async (data: FormValues) => {
  try {
    const response = await axios.post(`${API_URL}/customer/register/`, data);
    return response.data;
  } catch (error) {
    const message = await extractError(error);
    return { error: message };
  }
};
