import { IPostType } from "@/types";
import moment from "moment";
import { FaRegClock } from "react-icons/fa";
import { Link } from "react-router-dom";

const DisplayPost = ({ post }: { post: IPostType }) => {
  return (
    <div className="py-10 flex flex-col-reverse md:flex-row items-center border-b-2 border-gray-200">
      <div className="md:flex-[80%]">
        <div className="mt-3 md:mt-0 mb-2 flex items-center gap-6 md:gap-10">
          <h1 className="text-base md:text-lg font-bold">
            {post?.author_name}
          </h1>
          <div className="flex items-center gap-3">
            <FaRegClock className="text-xl" />
            <h1 className="text-base md:text-lg">
              {moment(post?.created_at).format("LLL")}
            </h1>
          </div>
        </div>
        <Link to={`/dashboard/posts/${post?.slug}`}>
          <h1 className="text-xl md:text-3xl font-semibold hover:underline cursor-pointer">
            {post?.title}
          </h1>
        </Link>
        <h1 className="mt-2 text-sm md:text-lg font-normal">
          {post?.short_description}
        </h1>
        <div className="mt-4 flex items-center gap-2">
          {post?.tags?.map((tag, i) => (
            <h1
              key={i}
              className="px-3 md:px-4 py-1 text-sm md:text-base bg-[#F0F0F0] hover:bg-[#F0F0F0]/70 cursor-pointer font-medium border-2 rounded-[30px]"
            >
              {tag}
            </h1>
          ))}
        </div>
      </div>

      <div className="md:flex-[20%]">
        <img
          className="h-40 md:h-44 w-screen md:w-72 object-cover rounded-md"
          src={post?.banner_img}
          alt="blog"
        />
      </div>
    </div>
  );
};

export default DisplayPost;
