import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { IoPersonOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    setShowMenu(false);
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signOut");
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
    <header className="bg-slate-200 shadow-md fixed left-0 right-0 z-10">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">S</span>
            <span className="text-slate-700">Esate</span>
          </h1>
        </Link>
        <form
          className="bg-slate-100 p-3 rounded-lg flex items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4 font-semibold pr-2">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          {currentUser ? (
            <div
              className="relative border-b-transparent border-b-[10px]"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <img
                className="rounded-full h-7 w-7 object-cover cursor-pointer"
                src={currentUser.avatar}
                alt="profile"
                onClick={toggleMenu}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-2 z-20">
                  <Link
                    to="/profile"
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items- justify-between"
                    onClick={() => setShowMenu(false)}
                  >
                    Profile
                    <IoPersonOutline className="text-green-600" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items- justify-between"
                  >
                    Sign out
                    <IoLogOutOutline className="text-blue-600" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/sign-in">
              <li className=" text-slate-700 hover:underline">Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
