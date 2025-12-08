import { Review } from "../services/product-details.service";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewSectionProps {
  reviews: Review[];
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h2>

      {/* Review List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-4 border-b pb-6 last:border-0"
          >
            <Avatar>
              <AvatarImage src={review.avatar} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {review.userName}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? "fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Review Form */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 font-medium text-gray-900">
          Viết đánh giá của bạn
        </h3>
        <div className="space-y-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                className="text-gray-300 hover:text-yellow-400"
              >
                <Star className="h-6 w-6" />
              </button>
            ))}
          </div>
          <Textarea placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..." />
          <Button>Gửi đánh giá</Button>
        </div>
      </div>
    </div>
  );
}
