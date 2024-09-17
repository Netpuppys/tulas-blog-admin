import { FaPenNib } from "react-icons/fa";
import { RiAlignItemLeftLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaAngleDoubleRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { TbCategory } from "react-icons/tb";
import { Home, Lock } from "lucide-react";

const Navigation = () => {
  const location = useLocation().pathname;

  const handleLogout = () => {
    localStorage.removeItem("crm_blog_token");
    window.location.href = "/";
  };

  return (
    <Sheet>
      <div className="py-3 px-5 md:px-10 flex justify-between items-center border-b-2 border-gray-200">
        <div className="flex items-center gap-6">
          <SheetTrigger>
            <FaAngleDoubleRight className="text-xl" />
          </SheetTrigger>
          <div className="text-xl md:text-2xl font-bold">Dashboard</div>
        </div>
        <div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      <SheetContent side={"left"}>
        <SheetHeader>
          <div className="pt-5">
            <SheetClose asChild>
              <Link to="/dashboard/home">
                <div
                  className={`${
                    location === "/dashboard/home"
                      ? "bg-gray-200 border-r-[3px] border-[#18181B]"
                      : ""
                  } mt-4 flex items-center gap-3 cursor-pointer py-3 px-4 rounded-l-md`}
                >
                  <Home className="text-xl md:text-2xl" />
                  <h1 className="text-lg md:text-xl font-medium">Home</h1>
                </div>
              </Link>
            </SheetClose>
            <SheetClose asChild>
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
            </SheetClose>

            <SheetClose asChild>
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
            </SheetClose>
            <SheetClose asChild>
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
            </SheetClose>
            <SheetClose asChild>
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
            </SheetClose>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
