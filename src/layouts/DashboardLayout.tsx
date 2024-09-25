import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { FaPenNib } from "react-icons/fa";
import { RiAlignItemLeftLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";
import { Link, Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation().pathname;

  const handleLogout = () => {
    localStorage.removeItem("crm_blog_token");
    window.location.href = "/";
  };

  return (
    <div>
      <div className="py-3 px-5 md:px-10 flex justify-between items-center border-b-2 border-gray-200">
        <div className="flex items-center gap-6">
          <div className="text-xl md:text-2xl font-bold">Dashboard</div>
        </div>
        <div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>
      <div className="pb-11 flex">
        <div className="flex-[20%] border-r-2 border-gray-100">
          <div className="pt-5">
            <Link to="/dashboard/all-posts">
              <div
                className={`${
                  location === "/dashboard/all-posts"
                    ? "bg-gray-200 border-r-[3px] border-[#18181B]"
                    : ""
                } mt-4 flex items-center gap-3 cursor-pointer py-3 px-4 rounded-l-md`}
              >
                <RiAlignItemLeftLine className="text-xl md:text-2xl" />
                <h1 className="text-lg md:text-xl font-medium">All Posts</h1>
              </div>
            </Link>

            <Link to={"/dashboard/create-post"}>
              <div
                className={`${
                  location === "/dashboard/create-post"
                    ? "bg-gray-200 border-r-[3px] border-[#18181B]"
                    : ""
                } mt-4 flex items-center gap-3 cursor-pointer py-3 px-4 rounded-l-md`}
              >
                <FaPenNib className="text-lg md:text-xl" />
                <h1 className="text-lg md:text-xl font-medium">
                  Create New Post
                </h1>
              </div>
            </Link>

            <Link to={"/dashboard/categories"}>
              <div
                className={`${
                  location === "/dashboard/categories"
                    ? "bg-gray-200 border-r-[3px] border-[#18181B]"
                    : ""
                } mt-4 flex items-center gap-3 cursor-pointer py-3 px-4 rounded-l-md`}
              >
                <TbCategory className="text-xl md:text-2xl" />
                <h1 className="text-lg md:text-xl font-medium">Categories</h1>
              </div>
            </Link>

            <Link to={"/dashboard/change-password"}>
              <div
                className={`${
                  location === "/dashboard/change-password"
                    ? "bg-gray-200 border-r-[3px] border-[#18181B]"
                    : ""
                } mt-4 flex items-center gap-3 cursor-pointer py-3 px-4 rounded-l-md`}
              >
                <Lock className="text-xl md:text-2xl" />
                <h1 className="text-lg md:text-xl font-medium">
                  Change Password
                </h1>
              </div>
            </Link>
          </div>
        </div>
        <div className="p-5 md:p-10 flex-[80%]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
