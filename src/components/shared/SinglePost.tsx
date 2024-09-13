import data from "@/utils/data.json";

const SinglePost = () => {
  return (
    <div>
      <div className="max-w-[700px] mx-auto">
        <div
          className="prose prose-red lg:prose-xl overflow-hidden"
          dangerouslySetInnerHTML={{ __html: data?.content }}
        ></div>
      </div>
    </div>
  );
};

export default SinglePost;
