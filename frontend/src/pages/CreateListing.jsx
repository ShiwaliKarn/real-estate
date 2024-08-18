import { IoIosArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const CreateListing = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 0,
    bathrooms: 0,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({
        ...prev,
        type: id,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      toast.success("Listing Done!");
      if (data.success === false) {
        setError(data.message);
        toast.error("Error in listing");
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      toast.error("Error in listing");
      setError(error.message);
      setLoading(false);
    }
  };

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

        <form
          className="flex flex-col sm:flex-row gap-4"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Title"
              className="border p-3 rounded-lg"
              id="name"
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              required
              onChange={handleChange}
              value={formData.address}
            />

            <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5 cursor-pointer"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <label htmlFor="sale">Sell</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5 cursor-pointer"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
                <label htmlFor="rent">Rent</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 cursor-pointer"
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <label htmlFor="parking">Parking spot</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 cursor-pointer"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <label htmlFor="furnished">Furnished</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5 cursor-pointer"
                  onChange={handleChange}
                  checked={formData.offer}
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
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <label htmlFor="bedrooms"> Bedrooms</label>
              </div>

              <div className="">
                <input
                  type="number"
                  id="bathrooms"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-16"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <label htmlFor="bathrooms"> Bath</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="phone"
                  id="regularPrice"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Regular price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">(₹ / month)</span>
                  )}
                </div>
              </div>

              {formData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="phone"
                    id="discountPrice"
                    required
                    className="p-3 border border-gray-300 rounded-lg"
                    onChange={handleChange}
                    value={formData.discountPrice}
                  />
                  <div className="flex flex-col items-center">
                    <p>Discounted price</p>

                    {formData.type === "rent" && (
                      <span className="text-xs">(₹/ month)</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={handleImageSubmit}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button
              disabled={loading || uploading}
              className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Creating..." : "Create listing"}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateListing;
