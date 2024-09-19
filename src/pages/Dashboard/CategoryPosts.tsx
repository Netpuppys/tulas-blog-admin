import DisplayPost from "@/components/shared/DisplayPost";
import PaginationHandler from "@/helpers/PaginationHandler";
import { IPostType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import ScrollToTop from "@/utils/ScrollToTop";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CategoryPosts = () => {
  const { categoryId } = useParams();

  const [categoryName, setCategoryName] = useState<string>("");
  const [postData, setPostData] = useState<IPostType[] | []>();

  const [totalData, setTotalData] = useState<number>(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await axiosInstance.get(
          `/category/${categoryId}/posts/?limit=10&page=${page}`
        );
        if (res?.data?.data) {
          setTotalData(res.data.meta.total);
          setPostData(res?.data?.data);
        }
      };

      const fetchCategoryName = async () => {
        const res = await axiosInstance.get(`/category/${categoryId}`);
        if (res?.data?.data) {
          setCategoryName(res?.data?.data?.name);
        }
      };

      fetchPosts();
      fetchCategoryName();
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
    }
  }, [page, categoryId]);

  return (
    <div>
      <ScrollToTop />
      <div>
        <h1 className="text-3xl font-semibold">
          Showing posts of - {categoryName}
        </h1>
        <h1 className="mt-3 text-base text-gray-700">
          Results found - {totalData}
        </h1>
      </div>
      {postData === null || postData === undefined ? (
        <LoaderCircle className="mx-auto my-32 text-3xl animate-spin" />
      ) : postData?.length > 0 ? (
        <div>
          {postData?.map((post) => (
            <div key={post?.id}>
              <DisplayPost post={post} />
            </div>
          ))}

          <div>
            <PaginationHandler
              totalResults={totalData}
              setPageNumber={setPage}
            />
          </div>
        </div>
      ) : (
        <h1 className="my-36 text-2xl text-center font-medium">No Posts Available</h1>
      )}
    </div>
  );
};

export default CategoryPosts;
