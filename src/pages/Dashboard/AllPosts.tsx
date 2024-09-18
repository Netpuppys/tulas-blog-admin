import DisplayPost from "@/components/shared/DisplayPost";
import { IPostType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import ScrollToTop from "@/utils/ScrollToTop";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AllPosts = () => {
  const [postData, setPostData] = useState<IPostType[] | []>();

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await axiosInstance.get("/post");
        if (res?.data?.data) {
          setPostData(res?.data?.data);
        }
      };

      fetchPosts();
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
    }
  }, []);

  return (
    <div>
      <ScrollToTop />
      <div className="flex items-center gap-5 border-b-2">
        <Link to={"/dashboard/all-posts"}>
          <h1 className="px-3 py-2 border-b-[3px] border-gray-900">Posts</h1>
        </Link>
        <Link to={"/dashboard/categories"}>
          <h1 className="px-3 py-2">Categories</h1>
        </Link>
      </div>
      <div>
        <h1 className="mt-10 text-3xl font-semibold">Posts</h1>
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
        </div>
      ) : (
        <h1 className="text-2xl text-center font-medium">No Posts Available</h1>
      )}
    </div>
  );
};

export default AllPosts;
