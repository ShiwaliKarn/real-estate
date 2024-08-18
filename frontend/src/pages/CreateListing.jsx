import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const CreateListing = () => {
  return (
    <main>
      <Link
        to="/profile"
        className="flex flex-nowrap curso font-semibold text-blue-600 items-center p-5"
      >
        <IoIosArrowBack />
        Go back to the previous page
      </Link>
      <div className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Create a Listing
        </h1>

        <form className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              required
            />
            <textarea
              name="Decription"
              placeholder="Description"
              id="decription"
              className="border p-3 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              required
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5 cursor-pointer"
                />
                <label htmlFor="sale">Sell</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5 cursor-pointer"
                />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 cursor-pointer"
                />
                <label htmlFor="parking">Parking spot</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 cursor-pointer"
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5 cursor-pointer"
                />
                <label htmlFor="offer">Offer</label>
              </div>
            </div>

            <div className="flex items-center gap-6 flex-wrap mt-3">
              <div className="">
                <input
                  type="number"
                  id="bedrooms"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-16"
                />
                <label htmlFor="bedrooms"> Bedrooms</label>
              </div>

              <div className="">
                <input
                  type="number"
                  id="bath"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-16"
                />
                <label htmlFor="bath"> Bath</label>
              </div>

              <div className="">
                <input
                  type="phone"
                  id="regularPrice"
                  required
                  className="p-3 border border-gray-300 rounded-lg  w-32"
                />
                <label htmlFor="regularPrice"> Regular Price (₹/month)</label>
              </div>

              <div className="">
                <input
                  type="phone"
                  id="discount"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-32"
                />
                <label htmlFor="discount"> Discounted price (₹/month)</label>
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <label className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2 text-sm">
                The first image will be cover (max 6)
              </span>
            </label>

            <div className="flex gap-4">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="p-3 border border-gray-300 rounded w-full cursor-pointer "
              />
              <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
                Upload
              </button>
            </div>
            <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              Create listing
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListing;
