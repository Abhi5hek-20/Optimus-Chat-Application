import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api.js";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  // Get friend requests to show notification indicator
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const hasNotifications = incomingRequests.length > 0;

  return (
      <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-18 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-3">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Optimus
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4 ml-auto">
            {/* Home Button */}
            <Link to="/" className="btn btn-ghost hover:bg-base-300 w-15 h-9">
              Home
            </Link>
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle hover:bg-base-300 relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {hasNotifications && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
              </button>
            </Link>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* User Avatar */}
            <div className="avatar cursor-pointer hover:bg-base-300 rounded-full p-1 transition-colors">
              <div className="w-9 rounded-full bg-base-300 flex items-center justify-center">
                <img 
                  src={authUser?.profilePic || `https://ui-avatars.com/api/?name=${authUser?.Fullname || 'User'}&background=570df8&color=fff&size=36`} 
                  alt="User Avatar" 
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `https://ui-avatars.com/api/?name=${authUser?.Fullname || 'User'}&background=570df8&color=fff&size=36`;
                  }}
                />
              </div>
            </div>

            {/* Logout button */}
            <button className="btn btn-ghost btn-circle hover:bg-base-300" onClick={logoutMutation}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;