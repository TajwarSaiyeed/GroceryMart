"use server";

import { API_URL } from "@/lib/utils";
import axios from "axios";
import { ReviewFormValues } from "../components/review-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const submitReview = async (
  productId: number,
  values: ReviewFormValues
) => {
  try {
    const session = await auth();

    if (!session) {
      return redirect("/sign-in");
    }

    const reviewData = {
      product: productId,
      ...values,
    };

    const response = await axios.post(
      `${API_URL}/product/reviews/`,
      reviewData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${session.user?.token}`,
        },
      }
    );
    return {
      data: response.data,
      message: "Review submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting review:", error);
    throw new Error("Failed to submit review");
  }
};

export const updateReview = async (
  reviewId: number,
  values: ReviewFormValues
) => {
  try {
    const session = await auth();

    if (!session) {
      return redirect("/sign-in");
    }

    const response = await axios.put(
      `${API_URL}/product/reviews/${reviewId}/`,
      values,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${session.user?.token}`,
        },
      }
    );
    return {
      data: response.data,
      message: "Review updated successfully",
    };
  } catch {
    throw new Error("Failed to update review");
  }
};


export const deleteReview = async (reviewId: number) => {
  try {
    const session = await auth();

    if (!session) {
      return redirect("/sign-in");
    }

    const response = await axios.delete(`${API_URL}/product/reviews/${reviewId}/`, {
      headers: {
        Authorization: `Token ${session.user?.token}`,
      },
    });
    return {
      data: response.data,
      message: "Review deleted successfully",
    };
  } catch {
    throw new Error("Failed to delete review");
  }
}