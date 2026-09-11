import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/profile": "My Profile",
  "/users": "Users",
  "/products": "Products",
  "/stock": "Stock",
  "/procurement": "Procurement",
  "/reports": "Reports",
};

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isHovering, setIsHovering] = useState(false);

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/70 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-semibold text-text-primary">
            {pageTitle}
          </h1>
        </div>

        {/* User Area */}
        <div
          className="flex items-center"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Role: always visible, always has a soft green glow */}
          <span className="hidden rounded-full bg-success/15 px-3 py-1 text-sm font-medium capitalize text-success shadow-[0_0_10px_2px_rgba(16,185,129,0.25)] transition-all duration-300 ease-out sm:block mr-2">
            {currentUser?.role}
          </span>

          {/* Name: collapsed by default, expands smoothly on hover */}
          <span
            className={`hidden overflow-hidden whitespace-nowrap text-sm font-medium text-text-primary transition-all duration-300 ease-out sm:block ${
              isHovering ? "max-w-[160px] opacity-100 mr-2" : "max-w-0 opacity-0 mr-0"
            }`}
          >
            {currentUser?.firstName} {currentUser?.lastName}
          </span>

          {/* Avatar: profile picture if available, else initial. Soft glow on hover */}
          <button
            type="button"
            onClick={handleProfile}
            title="Go to Profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600/15 text-sm font-semibold text-primary-500 transition-shadow duration-300 hover:shadow-[0_0_14px_4px_rgba(59,130,246,0.35)]"
          >
            {currentUser?.profileImage ? (
              <img
                src={currentUser.profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              currentUser?.firstName?.charAt(0)
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;