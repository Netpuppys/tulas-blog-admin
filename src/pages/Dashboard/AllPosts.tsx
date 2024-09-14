import DisplayPost from "@/components/shared/DisplayPost";
import ScrollToTop from "@/utils/ScrollToTop";
import { Link } from "react-router-dom";

const AllPosts = () => {
  const posts = [1, 2, 3, 4, 5];

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
      <div>
        {posts?.map((_post, i) => (
          <div key={i}>
            <DisplayPost />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
