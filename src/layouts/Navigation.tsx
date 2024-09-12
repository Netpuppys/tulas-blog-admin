import { FaPenNib, FaTags } from "react-icons/fa";
import { RiAlignItemLeftLine } from "react-icons/ri";
import { TbCategory } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { FaAngleDoubleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navigation = () => {
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
          <Button variant="destructive">Logout</Button>
        </div>
      </div>

      <SheetContent side={"left"}>
        <SheetHeader>
          <div className="pt-5 pl-1 md:pl-2">
            <SheetClose asChild>
              <Link to="/dashboard/all-posts">
                <div className="mt-4 flex items-center gap-3 cursor-pointer">
                  <RiAlignItemLeftLine className="text-xl md:text-2xl" />
                  <h1 className="text-lg md:text-xl font-medium">All Posts</h1>
                </div>
              </Link>
            </SheetClose>
            <div className="mt-4 md:mt-6 flex items-center gap-3 cursor-pointer">
              <FaPenNib className="text-lg md:text-xl" />
              <h1 className="text-lg md:text-xl font-medium">
                Create New Post
              </h1>
            </div>
            <div className="mt-4 md:mt-6 flex items-center gap-3 cursor-pointer">
              <TbCategory className="text-xl md:text-2xl" />
              <h1 className="text-lg md:text-xl font-medium">Categories</h1>
            </div>
            <div className="mt-4 md:mt-6 flex items-center gap-3 cursor-pointer">
              <FaTags className="text-lg md:text-xl" />
              <h1 className="text-lg md:text-xl font-medium">Tags</h1>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;
