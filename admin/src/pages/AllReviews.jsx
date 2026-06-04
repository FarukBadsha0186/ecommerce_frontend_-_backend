import React from "react";

const dummyReviews = [
  {
    _id: "1",
    user: { email: "farukuser1@gmail.com" },
    description: "Very well product",
    rating: "5",
    createdAt: "2026-03-24T17:24:36.950Z",
  },
  {
    _id: "2",
    user: { email: "farukuser2@gmail.com" },
    description: "Very good product",
    rating: "4",
    createdAt: "2026-03-13T14:20:05.681Z",
  },
  {
    _id: "3",
    user: null,
    description: "Excellent quality",
    rating: "5",
    createdAt: "2026-03-12T04:29:22.537Z",
  },
];

const useGuestCheck = () => {
  const isGuest = localStorage.getItem('isGuest') === 'true';
  const guestAlert = () => {
    if (isGuest) {
      alert('🔒 Demo Mode! This feature is for admin only!');
      return true;
    }
    return false;
  };
  return { isGuest, guestAlert };
};

function AllReviews() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">All Reviews</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyReviews.map((review) => (
          <div
            key={review._id}
            className="bg-gray-900 rounded-xl shadow p-4 hover:shadow-lg transition"
          >
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-orange-400">
                {review.user ? review.user.email : "Anonymous User"}
              </h2>
              <span className="text-sm bg-blue-600 px-2 py-1 rounded text-white">
                {review.rating}⭐
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-2">{review.description}</p>

            <p className="text-gray-500 text-xs">
              Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
            </p>

            <div className="flex justify-between mt-4">
              <button className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700 text-white text-sm">
                View Product
              </button>
              <button className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 text-white text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-gray-400 text-sm">
        Showing {dummyReviews.length} reviews.
      </div>
    </div>
  );
}

export default AllReviews;