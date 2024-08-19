import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
const ShowListings = () => {
  const { currentUserId } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/listings/${currentUserId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          toast.error("Error fetching listings");
          return;
        }
        setListings(data);
      } catch (error) {
        setError(true);
        toast.error("Error fetching listings");
      } finally {
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [currentUserId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading listings.</p>;

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Error deleting listing");
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      toast.success("Listing deleted successfully!");
    } catch (error) {
      toast.error("Error deleting listing");
    }
  };

  return (
    <div>
      {" "}
      <Link
        to="/profile"
        className="flex flex-nowrap curso font-semibold text-blue-600 items-center p-5 pt-20"
      >
        <IoIosArrowBack />
        Go back to the previous page
      </Link>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center uppercase my-2">
          Your Listings
        </h1>
        {listings.length === 0 ? (
          <p>No listings found.</p>
        ) : (
          listings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4 mb-4"
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="Listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-slate-700 font-semibold hover:underline truncate flex-1"
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <Link to={`/update-listing/${listing._id}`}>
                  <button className="text-green-600 uppercase mb-1 font-semibold">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDeleteListing(listing._id)}
                  className="text-red-600 uppercase font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShowListings;
