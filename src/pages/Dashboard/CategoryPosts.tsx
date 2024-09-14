import DisplayPost from "@/components/shared/DisplayPost";
import ScrollToTop from "@/utils/ScrollToTop";

const CategoryPosts = () => {
  const posts = [1, 2, 3, 4, 5];

  return (
    <div>
      <ScrollToTop />
      <div>
        <h1 className="text-3xl font-semibold">
          Showing posts of - Lorem, ipsum.
        </h1>
        <h1 className="mt-3 text-base text-gray-700">Results found - 7</h1>
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

export default CategoryPosts;
