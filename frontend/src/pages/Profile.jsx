import { useSelector } from "react-redux";
import { IoLogOutOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="rounded-full h-24 w-24 object-cove cursor-pointer self-center mt-2"
          src={currentUser.avatar}
          alt="Profile Image"
        />

        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600 cursor-pointer font-semibold flex items-center flex-nowrap gap-1">
          Delete account
          <MdDelete className=" text-xl mt-[.5px]" />
        </span>
        <span className="text-blue-500 cursor-pointer font-semibold flex items-center flex-nowrap gap-1">
          Sign Out
          <IoLogOutOutline className=" text-xl mt-[2px] " />
        </span>
      </div>
    </div>
  );
};

export default Profile;
