"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateReview } from "../actions/manage-review";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
});

interface EditReviewFormProps {
  review: {
    id: number;
    rating: number;
    description: string;
  };
  onCancel: () => void;
  onSuccess: () => void;
}

const ReviewChoices = [
  { value: 1, label: "Poor" },
  { value: 2, label: "Fair" },
  { value: 3, label: "Good" },
  { value: 4, label: "Very Good" },
  { value: 5, label: "Excellent" },
];

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const EditReviewForm = ({
  review,
  onCancel,
  onSuccess,
}: EditReviewFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: review.rating,
      description: review.description,
    },
  });

  const onSubmit = async (values: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      toast.loading("Updating review...");
      await updateReview(review.id, values);
      toast.success("Review updated successfully");
      onSuccess();
    } catch {
      toast.error("Error", {
        description: "Failed to update review. Please try again.",
      });
    } finally {
      toast.dismiss();
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ReviewChoices.map((choice) => (
                    <SelectItem key={choice.value} value={String(choice.value)}>
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Review"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
