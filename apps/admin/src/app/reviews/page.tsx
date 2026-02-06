import { Star, MessageSquare } from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockReviews = [
  {
    id: "r1",
    productName: "Sony WH-1000XM5",
    userName: "Alex Johnson",
    rating: 5,
    title: "Best noise cancelling headphones",
    body: "Incredible sound quality and the ANC is unmatched. Battery lasts forever.",
    verifiedPurchase: true,
    createdAt: "2025-01-14",
  },
  {
    id: "r2",
    productName: "Apple AirPods Pro 2",
    userName: "Maria Garcia",
    rating: 4,
    title: "Great earbuds with minor issues",
    body: "Sound quality is excellent and ANC works well. Wish the case was more durable.",
    verifiedPurchase: true,
    createdAt: "2025-01-13",
  },
  {
    id: "r3",
    productName: "Samsung Galaxy Watch 6",
    userName: "James Wilson",
    rating: 4,
    title: "Solid smartwatch",
    body: "Great display and good fitness tracking. Battery could be better though.",
    verifiedPurchase: false,
    createdAt: "2025-01-12",
  },
  {
    id: "r4",
    productName: "JBL Charge 5",
    userName: "Sarah Chen",
    rating: 5,
    title: "Perfect portable speaker",
    body: "Amazing sound for its size. Waterproof and battery lasts all day at the beach.",
    verifiedPurchase: true,
    createdAt: "2025-01-11",
  },
  {
    id: "r5",
    productName: "Bose QuietComfort Ultra",
    userName: "Daniel Kim",
    rating: 3,
    title: "Good but overpriced",
    body: "Sound quality is great but I expected more for the price. Comfort is top notch.",
    verifiedPurchase: true,
    createdAt: "2025-01-10",
  },
  {
    id: "r6",
    productName: "Sony WH-1000XM5",
    userName: "Emily Brown",
    rating: 5,
    title: "Worth every penny",
    body: "Upgraded from XM4 and the improvements are noticeable. Much lighter and comfier.",
    verifiedPurchase: true,
    createdAt: "2025-01-09",
  },
];

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "text-zinc-700"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Reviews</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Monitor customer feedback and product reviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Total Reviews</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {mockReviews.length}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Average Rating</p>
          <div className="mt-1 flex items-center gap-2">
            <p className="text-2xl font-bold text-white">
              {(
                mockReviews.reduce((sum, r) => sum + r.rating, 0) /
                mockReviews.length
              ).toFixed(1)}
            </p>
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="text-sm text-zinc-400">Verified Purchases</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {mockReviews.filter((r) => r.verifiedPurchase).length}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      {mockReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16">
          <MessageSquare className="h-12 w-12 text-zinc-700" />
          <p className="mt-4 text-sm font-medium text-zinc-400">
            No reviews yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold text-white">
                      {review.title}
                    </h3>
                    {review.verifiedPurchase && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    {renderStars(review.rating)}
                    <span className="text-xs text-zinc-500">
                      by {review.userName}
                    </span>
                    <span className="text-xs text-zinc-600">&middot;</span>
                    <span className="text-xs text-zinc-500">
                      {review.createdAt}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                  {review.productName}
                </span>
              </div>
              <p className="mt-3 text-sm text-zinc-300">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
