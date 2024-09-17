import data from "@/utils/data.json";
import ScrollToTop from "@/utils/ScrollToTop";
import { Edit, Trash2 } from "lucide-react";

const SinglePost = () => {
  return (
    <div>
      <ScrollToTop />
      <div className="max-w-[700px] mx-auto">
        <div className="prose prose-red lg:prose-xl ">
          <header>
            <h1 className="!mb-3">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut?
            </h1>
            <div className="!mb-3 flex justify-between items-center">
              <p>
                Published on August 5, 2024 by <strong>Admin</strong>
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
            src="https://picsum.photos/800/400"
            className="rounded-md"
            alt="blog_img"
          />
        </div>

        <div
          className="prose prose-red lg:prose-xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        ></div>
      </div>
    </div>
  );
};

export default SinglePost;
