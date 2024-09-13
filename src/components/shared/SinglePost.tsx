import data from "@/utils/data.json";

const SinglePost = () => {
  return (
    <div>
      <div className="max-w-[700px] mx-auto">
        <div className="prose prose-red lg:prose-xl ">
          <header>
            <h1>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut?
            </h1>
            <p>
              Published on August 5, 2024 by <strong>Admin</strong>
            </p>
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
