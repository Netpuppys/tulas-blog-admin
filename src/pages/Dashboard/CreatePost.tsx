import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [editorValue, setEditorValue] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "subscript", "superscript"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "subscript",
    "superscript",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "align",
  ];

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
          <div className="mt-5">
            <ReactQuill
              theme="snow"
              value={editorValue}
              onChange={setEditorValue}
              modules={modules}
              formats={formats}
              placeholder="Write your blog content here..."
            />
          </div>
        </div>
        <div className="flex-[30%]">
          <div className="py-6 px-5 border-2 border-gray-300 rounded-sm">
            <h1 className="mb-3 text-lg font-medium">Category</h1>
            <div className="w-full">
              <Select>
                <SelectTrigger className="text-black font-medium outline-none">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="text-black font-medium">
                  <SelectItem value="1">Category 1</SelectItem>
                  <SelectItem value="2">Category 2</SelectItem>
                  <SelectItem value="3">Category 3</SelectItem>
                  <SelectItem value="4">Category 4</SelectItem>
                  <SelectItem value="5">Category 5</SelectItem>
                  <SelectItem value="6">Category 6</SelectItem>
                  <SelectItem value="7">Category 7</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-3 py-6 px-5 border-2 border-gray-300 rounded-sm">
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
              className="px-4 py-3 h-32 w-full text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
              placeholder="Enter Short Description"
            />
          </div>
          <div className="mt-3 py-6 px-5 border-2 border-gray-300 rounded-sm">
            <h1 className="mb-3 text-lg font-medium">Meta Description</h1>

            <textarea
              className="px-4 py-3 h-32 w-full text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
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
