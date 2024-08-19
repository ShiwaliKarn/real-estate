import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { IoIosCamera, IoMdCreate } from "react-icons/io";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [editable, setEditable] = useState({
    username: false,
    email: false,
    password: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (fileUploadError || filePerc === 100) {
      setTimeout(() => {
        setFileUploadError(false);
        setFilePerc(0);
      }, 4000);
    }
  }, [filePerc, fileUploadError]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleEditClick = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePasswordClick = () => {
    setShowPasswordFields(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.reEnterpassword) {
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Error updating profile");
        dispatch(updateUserFailure(data.message));
        console.log(data.message);
        return;
      }
      setShowPasswordFields(false);
      setEditable({
        username: false,
        email: false,
        password: false,
      });
      toast.success("Profile Updated");
      dispatch(updateUserSuccess(data));
    } catch (error) {
      console.log(error);

      dispatch(updateUserFailure(error.message));
      toast.error("Error updating profile");
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete) {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          toast.error("Error deleting account");
          dispatch(deleteUserFailure(data.message));
          return;
        }
        toast.success("Account deleted successfully!");
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        toast.error("Error deleting account");
        dispatch(deleteUserFailure(error.message));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        toast.error("Logout failed");
        dispatch(deleteUserFailure(data.message));
        return;
      }
      toast.success("Logged Out");
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      toast.error("Logout failed");
      dispatch(deleteUserFailure(data.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className="text-3xl font-semibold text-center uppercase my-2">
        Profile
      </h1>
      <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/*"
        />
        <div className="relative self-center mt-2">
          <img
            className="rounded-full h-24 w-24 object-cover cursor-pointer"
            src={formData.avatar || currentUser.avatar}
            alt="Profile Image"
          />
          <p className="text-sm ">
            {fileUploadError ? (
              <span className="text-red-600">
                Error uploading image(image must be less than 2mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-600">Image uploaded</span>
            ) : (
              ""
            )}
          </p>
          <div
            onClick={() => fileRef.current.click()}
            className="h-24 w-24 absolute inset-0 bg-black opacity-0 hover:opacity-40 transition-opacity rounded-full flex items-center justify-center cursor-pointer"
          >
            <IoIosCamera className="text-white text-2xl" />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="username"
            id="username"
            className="border-2  p-3 rounded-lg w-full disabled:bg-slate-100 "
            value={formData.username || currentUser.username}
            onChange={handleChange}
            disabled={!editable.username}
          />
          <IoMdCreate
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => handleEditClick("username")}
          />
        </div>

        <div className="relative">
          <input
            type="email"
            placeholder="email"
            id="email"
            value={formData.email || currentUser.email}
            className="p-3 rounded-lg w-full border-2  disabled:bg-slate-100 "
            onChange={handleChange}
            disabled={!editable.email}
          />
          <IoMdCreate
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => handleEditClick("email")}
          />
        </div>

        <p
          className="text-sm text-blue-500 font-semibold cursor-pointer ml-1"
          onClick={handleChangePasswordClick}
        >
          Change Password?
        </p>

        {showPasswordFields && (
          <>
            <input
              type="password"
              placeholder="New password"
              id="password"
              className="border-2  p-3 rounded-lg w-full"
              onChange={handleChange}
              minLength={8}
            />

            <input
              type="password"
              placeholder="Re-enter password"
              id="reEnterpassword"
              className="border-2  p-3 rounded-lg w-full"
              onChange={handleChange}
            />
            {formData.password &&
              formData.reEnterpassword &&
              formData.password !== formData.reEnterpassword && (
                <p className="text-red-600 text-sm">Passwords do not match</p>
              )}
          </>
        )}
        <button
          className=" bg-blue-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 disabled:cursor-wait"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <Link
          className="bg-slate-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
          to={`/user-listings/${currentUser._id}`}
        >
          Show listings
        </Link>

        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
          to="/create-listing"
        >
          Create a new listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-600 cursor-pointer font-semibold flex items-center flex-nowrap gap-1"
          onClick={handleDeleteUser}
        >
          Delete account
          <MdDelete className=" text-xl mt-[.5px]" />
        </span>
        <span
          className="text-blue-500 cursor-pointer font-semibold flex items-center flex-nowrap gap-1"
          onClick={handleSignOut}
        >
          Sign Out
          <IoLogOutOutline className=" text-xl mt-[2px] " />
        </span>
      </div>
    </div>
  );
};

export default Profile;
