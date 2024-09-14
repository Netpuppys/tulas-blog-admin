import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ScrollToTop from "@/utils/ScrollToTop";
import { Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-center gap-5 border-b-2">
        <Link to={"/dashboard/all-posts"}>
          <h1 className="px-3 py-2">Posts</h1>
        </Link>
        <Link to={"/dashboard/categories"}>
          <h1 className="px-3 py-2 border-b-[3px] border-gray-900">
            Categories
          </h1>
        </Link>
      </div>
      <div>
        <h1 className="mt-10 text-3xl font-semibold">Categories</h1>
      </div>
      <div className="md:w-1/2 mt-10 py-6 px-5 border-2 border-gray-300 rounded-sm">
        <h1 className="mb-3 text-lg font-medium">Create Category</h1>
        <div className="flex gap-2">
          <input
            className="px-3 md:px-4 py-2 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md outline-none"
            type="text"
            placeholder="Enter Category Name"
          />
          <Button variant={"default"}>Create</Button>
        </div>
      </div>

      <div className="mt-10">
        <Table>
          <TableCaption>A list of categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((_category, i) => (
              <TableRow key={i}>
                <Link to={"/dashboard/categories/1"}>
                <TableCell className="font-medium">Lorem, ipsum.</TableCell>
                </Link>
                <TableCell>9</TableCell>
                <TableCell className="flex justify-end items-center gap-3 md:gap-4">
                  <Edit />
                  <Trash2 className="h-7 w-7 text-red-600" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Categories;
