"use server";

import { auth } from "@/auth";
import { API_URL } from "@/lib/utils";
import axios from "axios";
import { revalidatePath } from "next/cache";

type DepositInput = {
  amount: number;
};

export async function createDeposit(data: DepositInput) {
  try {
    const session = await auth();

    if (!session) {
      return {
        success: false,
        message: "You must be logged in to deposit funds",
      };
    }

    const response = await axios.post(`${API_URL}/customer/deposit/`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session?.user?.token}`,
      },
    });

    if (response.status === 201) {
      revalidatePath("/user");
      return {
        success: true,
        message: "Deposit successful! Check your email for confirmation.",
      };
    }

    return {
      success: false,
      message: "An error occurred while processing your deposit",
    };
  } catch {
    return {
      success: false,
      message: "An error occurred while processing your deposit",
    };
  }
}


export async function getDepositHistory() {
  try {
    const session = await auth();

    if (!session) {
      return {
        success: false,
        message: "You must be logged in to view deposit history",
      };
    }

    const response = await axios.get(`${API_URL}/customer/deposit/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session?.user?.token}`,
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
      };
    }

    return {
      success: false,
      message: "An error occurred while fetching deposit history",
    };
  } catch {
    return {
      success: false,
      message: "An error occurred while fetching deposit history",
    };
  }
}