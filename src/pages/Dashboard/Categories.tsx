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
import { ICategoryType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import ScrollToTop from "@/utils/ScrollToTop";
import { Edit, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { DeleteCategory } from "./modals/DeleteCategory";

const Categories = () => {
  const [categoryData, setCategoryData] = useState<ICategoryType[] | []>();
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    try {
      const fetchCategories = async () => {
        const res = await axiosInstance.get("/category");
        if (res?.data?.data) {
          setCategoryData(res?.data?.data);
        }
      };

      fetchCategories();
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
    }
  }, [refetch]);

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

      {categoryData === null || categoryData === undefined ? (
        <LoaderCircle className="mx-auto my-32 text-3xl animate-spin" />
      ) : (
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
            {categoryData?.length > 0 ? (
              <TableBody>
                {categoryData.map((category: ICategoryType) => (
                  <TableRow key={category?.id}>
                    <Link to={"/dashboard/categories/" + category?.id}>
                      <TableCell className="font-medium">
                        {category?.name}
                      </TableCell>
                    </Link>
                    <TableCell>{category?.postCount}</TableCell>
                    <TableCell className="flex justify-end items-center gap-3 md:gap-4">
                      <Edit />
                      <DeleteCategory
                        id={category?.id}
                        refetch={refetch}
                        setRefetch={setRefetch}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <div>No Categories found</div>
            )}
          </Table>
        </div>
      )}
    </div>
  );
};

export default Categories;
