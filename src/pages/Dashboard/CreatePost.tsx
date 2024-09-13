import { Button } from "@/components/ui/button";

const CreatePost = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Create New Post</h1>
      <div className="mt-10 flex gap-5">
        <div className="flex-[70%]">
          <div className="h-72 flex items-center justify-center bg-gray-100 border-2 border-gray-200 rounded-md">
            <h1 className="text-2xl font-medium text-gray-500">Blog Banner</h1>
            <input
              className="absolute opacity-0 cursor-pointer"
              type="file"
              name=""
              id=""
            />
          </div>
          <div>
            <input
              className="mt-5 px-4 py-4 w-full text-xl bg-gray-100 border-b-2 border-gray-200 rounded-md outline-none"
              type="text"
              placeholder="Enter Blog Title"
            />
          </div>
          <div className="mt-5">editor</div>
        </div>
        <div className="flex-[30%]">
          <div className="py-6 px-5 border-2 border-gray-300 rounded-sm">
            <h1 className="mb-3 text-lg font-medium">Tags</h1>
            <div className="flex gap-2">
              <input
                className="px-4 py-2 w-full text-base bg-gray-100 border-b-2 border-gray-200 rounded-md outline-none"
                type="text"
                placeholder="Enter Tags"
              />
              <Button variant={"default"}>Add</Button>
            </div>
            <p className="mt-3 text-sm text-red-500 font-medium">
              *Separate tags with commas.
            </p>
          </div>
          <div className="mt-3 py-6 px-5 border-2 border-gray-300 rounded-sm">
            <h1 className="mb-3 text-lg font-medium">Short Description</h1>

            <textarea
              className="px-4 py-2 h-32 w-full text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
              placeholder="Enter Short Description"
            />
          </div>
          <div className="mt-3 py-6 px-5 border-2 border-gray-300 rounded-sm">
            <h1 className="mb-3 text-lg font-medium">Meta Description</h1>

            <textarea
              className="px-4 py-2 h-32 w-full text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
              placeholder="Enter Meta Description"
            />
          </div>
          <div className="mt-3 py-6 px-5 border-2 border-gray-300 rounded-sm">
            <h1 className="mb-3 text-lg font-medium">Author Name</h1>

            <input
              className="px-4 py-2 w-full text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
              type="text"
              placeholder="Enter Author Name"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
