import { DeletePost } from "@/pages/Dashboard/modals/DeletePost";
import { IPostType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import { Edit, LoaderCircle } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { GoDash } from "react-icons/go";
import { Link, useParams } from "react-router-dom";

interface ILinkType {
  text: string;
  id: string;
  tagName: string;
}

const SinglePost = () => {
  const { slug } = useParams();
  const [postData, setPostData] = useState<IPostType | null>(null);
  const [tocItems, setTocItems] = useState<ILinkType[] | []>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axiosInstance.get(`/post/${slug}`);
      if (res?.data?.data) {
        setPostData(res?.data?.data);
        generateToc(res.data.data.content); // Generate TOC from content
      }
    };

    const generateToc = (htmlContent: string) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      const headings = tempDiv.querySelectorAll("h1, h2, h3");
      const tocList = Array.from(headings).map((heading) => ({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        text: heading.innerText,
        id: heading.id,
        tagName: heading.tagName.toLowerCase(), // Get the tag name (h1, h2, h3)
      }));

      setTocItems(tocList);
    };

    fetchPost();
  }, [slug]);

  return (
    <div>
      <div className="max-w-[700px] mx-auto">
        {postData === null ? (
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
                    <Link to={`/dashboard/posts/${postData?.slug}/edit`}>
                      <Edit className="text-black" />
                    </Link>
                    <DeletePost id={postData?.id} />
                  </div>
                </div>
              </header>
            </div>

            {/* Table of Contents */}
            {tocItems.length > 0 && (
              <div className="my-8">
                <h1 className="text-3xl text-red-600 font-bold mb-4">
                  Table of Contents
                </h1>
                <ul className="toc-list">
                  {tocItems.map((item: ILinkType) => (
                    <li key={item.id} className="my-3 flex items-center gap-3">
                      {item?.tagName === "h1" ? (
                        <GoDash className="text-gray-500" />
                      ) : (
                        ""
                      )}
                      <a
                        href={`#${item.id}`}
                        className={`
              ${
                item.tagName === "h1"
                  ? "text-xl"
                  : item.tagName === "h2"
                  ? "ml-7 pl-6 text-lg border-l-[3px] border-gray-300"
                  : item.tagName === "h3"
                  ? "ml-7 pl-12 text-base border-l-[3px] border-gray-300"
                  : ""
              } hover:text-red-600 transition duration-200
            `}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Blog Content */}
            <div
              className="prose prose-red lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: postData?.content }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;
