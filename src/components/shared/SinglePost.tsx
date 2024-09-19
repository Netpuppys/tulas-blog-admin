import { IPostType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import ScrollToTop from "@/utils/ScrollToTop";
import { Edit, LoaderCircle, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const SinglePost = () => {
  const { slug } = useParams();

  const [postData, setPostData] = useState<IPostType | null>(null);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await axiosInstance.get(`/post/${slug}`);
        if (res?.data?.data) {
          setPostData(res?.data?.data);
        }
      };

      fetchPost();
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
    }
  }, [slug]);

  return (
    <div>
      <ScrollToTop />
      <div className="max-w-[700px] mx-auto">
        {postData === null || postData === undefined ? (
          <LoaderCircle className="mx-auto my-36 h-12 w-12 text-3xl animate-spin" />
        ) : (
          <div>
            <div className="prose prose-red lg:prose-xl ">
              <header>
                <h1 className="!mb-3">{postData?.title}</h1>
                <div className="!mb-3 flex justify-between items-center">
                  <p>
                    Published on {moment(postData?.created_at).format("LL")} by{" "}
                    <strong>{postData?.author_name}</strong>
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Edit />
                    <Trash2 className="h-7 w-7 text-red-600" />
                  </div>
                </div>
              </header>
            </div>

            <div>
              <img
                src={postData?.banner_img}
                className="rounded-md"
                alt="blog_img"
              />
            </div>

            <div
              className="prose prose-red lg:prose-xl overflow-hidden"
              dangerouslySetInnerHTML={{ __html: postData?.content }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
