import { Button } from "@/components/ui/button";
import { IPostType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import FakeLoader from "@/utils/FakeLoader";
import { Image } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;

const EditPost = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { slug } = useParams();
  const [postData, setPostData] = useState<IPostType | null>(null);
  const [editorHtml, setEditorHtml] = useState<string>(
    __ISMSIE__ ? "<p>&nbsp;</p>" : ""
  ); // Default for MSIE

  const reactQuillRef = useRef<ReactQuill>(null);
  const inputOpenImageRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);

  console.log(files);

  // Fetch the post data based on slug
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/post/${slug}`);
        if (res?.data?.data) {
          setPostData(res?.data?.data);
          setEditorHtml(res?.data?.data?.content || ""); // Set post content as default value in editor
        }
      } catch (err: unknown) {
        const error = err as { response: { data: { message: string } } };
        toast.error(error?.response?.data?.message);
      }
    };

    fetchPost();
  }, [slug]);

  const handleChange = (html: string) => {
    setEditorHtml(html); // Update the editor state as the user types
  };

  const imageHandler = () => {
    inputOpenImageRef.current?.click(); // Open file input for image upload
  };

  const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      const file = e.currentTarget.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", `${Date.now()}.jpg`);

      try {
        const response = await axiosInstance.post(
          "/common/file-upload",
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );

        if (response.data.success) {
          const quill = reactQuillRef.current?.getEditor();
          const range = quill?.getSelection();
          const position = range ? range.index : 0;

          quill?.insertEmbed(position, "image", response.data.data);
          quill?.setSelection(position + 1);

          // Update the editor's HTML
          const updatedHtml = quill?.root.innerHTML;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setEditorHtml(updatedHtml);

          setFiles((prevFiles) => [...prevFiles, file]);
        } else {
          alert("Failed to upload file");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const editPostHandler = async () => {
    setIsLoading(true);
    const data = {
      content: editorHtml,
    };

    try {
      const updateRes = await axiosInstance.patch(
        `/post/${postData?.id}`,
        data
      );
      if (updateRes?.data?.data) {
        toast.success("Post updated successfully");
        navigate(`/dashboard/posts/${postData?.slug}`);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div>
      {isLoading && <FakeLoader />}
      {postData && (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-3xl font-semibold">Update Post</h1>
            <Button onClick={editPostHandler} variant={`default`}>
              Update
            </Button>
          </div>

          <div className="mt-5">
            <div>
              <div id="toolbar">
                <select
                  className="ql-header"
                  defaultValue={""}
                  onChange={(e) => e.persist()}
                >
                  <option value="1" />
                  <option value="2" />
                  <option value="3" />
                  <option value="" />
                </select>
                <button className="ql-bold" />
                <button className="ql-italic" />
                <button className="ql-underline" />
                <button className="ql-strike" />
                <button className="ql-insertImage" onClick={imageHandler}>
                  <Image />
                </button>
                <button className="ql-link" />
                <button className="ql-code-block" />
                <button className="ql-blockquote" />
                <button className="ql-list" value="ordered" />
                <button className="ql-list" value="bullet" />
                <button className="ql-indent" value="-1" />
                <button className="ql-indent" value="+1" />
                <button className="ql-align" />
                <button className="ql-script" value="sub" />
                <button className="ql-script" value="super" />
                <button className="ql-check" />
                <button className="ql-clean" />
              </div>

              {/* React Quill Editor */}
              <ReactQuill
                ref={reactQuillRef}
                theme="snow"
                onChange={handleChange}
                modules={modules}
                formats={formats}
                value={editorHtml} // Set initial value
                placeholder="Write something awesome..."
              />

              {/* Hidden file input for image uploads */}
              <input
                type="file"
                accept="image/*"
                ref={inputOpenImageRef}
                style={{ display: "none" }}
                onChange={insertImage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// React Quill modules and formats
const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      insertImage: () => {}, // Custom image handler already set up
    },
  },
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "image",
  "link",
  "code-block",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "align",
  "script",
  "subscript",
  "superscript",
  "check",
  "clean",
];

export default EditPost;
