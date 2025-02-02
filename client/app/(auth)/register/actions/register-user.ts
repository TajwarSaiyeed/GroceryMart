"use server";
import { FormValues } from "../page";
import axios from "axios";
import { API_URL } from "@/lib/utils";

export const registerUser = async (data: FormValues) => {
  try {
    const response = await axios.post(`${API_URL}/customer/register/`, data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
