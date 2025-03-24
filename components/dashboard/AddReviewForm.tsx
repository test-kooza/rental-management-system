"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import { createReview } from "@/actions/property-detailed"

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review comment must be at least 10 characters"),
  cleanliness: z.number().min(1).max(5).optional(),
  accuracy: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  location: z.number().min(1).max(5).optional(),
  checkIn: z.number().min(1).max(5).optional(),
  value: z.number().min(1).max(5).optional(),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

type AddReviewFormProps = {
  propertyId: string
  onSuccess?: () => void
}

export default function AddReviewForm({ propertyId, onSuccess }: AddReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      cleanliness: 0,
      accuracy: 0,
      communication: 0,
      location: 0,
      checkIn: 0,
      value: 0,
    },
  })

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await createReview({
        propertyId,
        ...data,
      })

      if (result.success) {
        toast.success("Thank you for your feedback!")
        form.reset()
        if (onSuccess) onSuccess()
      } else {
        toast.error("Please First Login.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number
    onChange: (value: number) => void
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <Star
              className={`h-6 w-6 ${star <= value ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="overall">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overall">Overall Rating</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Ratings</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <StarRating value={field.value} onChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cleanliness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cleanliness</FormLabel>
                    <FormControl>
                      <StarRating value={field.value || 0} onChange={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accuracy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accuracy</FormLabel>
                    <FormControl>
                      <StarRating value={field.value || 0} onChange={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="communication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Communication</FormLabel>
                    <FormControl>
                      <StarRating value={field.value || 0} onChange={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <StarRating value={field.value || 0} onChange={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Check-in</FormLabel>
                    <FormControl>
                      <StarRating value={field.value || 0} onChange={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <StarRating value={field.value || 0} onChange={(value) => field.onChange(value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this property..."
                  className="resize-none h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  )
}

