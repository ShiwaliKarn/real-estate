// import { Link } from "react-router-dom";
// import { IoIosArrowBack } from "react-icons/io";
// import { useSelector } from "react-redux";
// import { useState } from "react";

// const ShowListings = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const [showListingsError, setShowListingsError] = useState(false);
//   const [userListings, setUserListings] = useState([]);

//   const listings = async () => {
//     try {
//       setShowListingsError(false);
//       const res = await fetch(`api/user/listings/${currentUser._id}`);
//       const data = await res.json();

//       if (data.success === false) {
//         setShowListingsError(true);
//         return;
//       }
//       setUserListings(data);
//     } catch (error) {
//       setShowListingsError(true);
//     }
//   };

//   return (
//     <div>
//       <Link
//         to="/profile"
//         className="flex flex-nowrap curso font-semibold text-blue-600 items-center p-5 pt-20"
//       >
//         <IoIosArrowBack />
//         Go back to the previous page
//       </Link>

//       {listings &&
//         listings.length > 0 &&
//         userListings.map((listing) => {
//           <div key={listing._id} className="">
//             <Link to={`/listing/${listing._id}`}>
//               <img src={listing.imageUrls[0]} alt="Listing cover" />
//             </Link>
//           </div>;
//         })}

//       <p>{showListingsError ? "Error showing listings" : ""}</p>
//     </div>
//   );
// };

// export default ShowListings;

import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const ShowListings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const fetchListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data.listings);
    } catch (error) {
      console.log(error);

      setShowListingsError(true);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentUser._id]);

  return (
    <div>
      <Link
        to="/profile"
        className="flex flex-nowrap font-semibold text-blue-600 items-center p-5 pt-20"
      >
        <IoIosArrowBack />
        Go back to the previous page
      </Link>

      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>

      {userListings && userListings.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-16 w-16 object-contain"
              />
              <div className="ml-4">
                <h2 className="font-semibold">{listing.name}</h2>
                <p>{listing.address}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showListingsError && (
          <p className="mt-5 text-center">No listings found.</p>
        )
      )}
    </div>
  );
};

export default ShowListings;
