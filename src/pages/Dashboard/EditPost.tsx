import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategoryType, IPostType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import FakeLoader from "@/utils/FakeLoader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Please enter a title name.",
  }),
  short_description: z.string().min(1, {
    message: "Please enter a short description.",
  }),
  meta_description: z.string().min(1, {
    message: "Please enter a meta description.",
  }),
  tags: z.string().min(1, {
    message: "Please enter atleast one tag.",
  }),
  meta_keywords: z.string().min(1, {
    message: "Please enter atleast one meta keyword.",
  }),
  author_name: z.string().min(1, {
    message: "Please enter an author name.",
  }),
  slug: z.string().min(1, {
    message: "Please enter a slug.",
  }),
  category_id: z.string().min(1, {
    message: "Please select a category.",
  }),
});

const EditPost = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { slug } = useParams();
  const [postData, setPostData] = useState<IPostType | null>(null);
  const [categoryData, setCategoryData] = useState<ICategoryType[] | []>();
  const [selectedImage, setSelectedImage] = useState<unknown | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [editorHtml, setEditorHtml] = useState<string>(
    __ISMSIE__ ? "<p>&nbsp;</p>" : ""
  ); // Default for MSIE

  const reactQuillRef = useRef<ReactQuill>(null);
  const inputOpenImageRef = useRef<HTMLInputElement>(null);

  //@ts-ignore
  const [files, setFiles] = useState<File[]>([]);

  // Fetch the post data based on slug
  useEffect(() => {
    try {
      setIsLoading(true);
      const fetchCategories = async () => {
        const res = await axiosInstance.get("/category");
        if (res?.data?.data) {
          setCategoryData(res?.data?.data);
        }
      };
      const fetchPost = async () => {
        const res = await axiosInstance.get(`/post/${slug}`);
        if (res?.data?.data) {
          setPostData(res?.data?.data);
          setEditorHtml(res?.data?.data?.content || ""); // Set post content as default value in editor
          setImgUrl(res?.data?.data?.banner_img);
          setIsLoading(false);
        }
      };

      fetchCategories();
      fetchPost();
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  }, [slug]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: postData?.title,
      short_description: postData?.short_description,
      meta_description: postData?.meta_description,
      tags: postData?.tags.join(", "),
      meta_keywords: postData?.meta_keywords.join(", "),
      author_name: postData?.author_name,
      slug: postData?.slug,
      category_id: postData?.category_id,
    },
  });

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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImgUrl(imageUrl);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const tagsInArray = data?.tags
      ?.split(",")
      .map((tag) => tag.trim())
      .slice(0, 6);
    const metaKeyWordsInArray = data?.meta_keywords
      ?.split(",")
      .map((keyword) => keyword.trim())
      .slice(0, 10);

    if (
      editorHtml == "<p><br></p>" ||
      editorHtml == "<p>&nbsp;</p>" ||
      editorHtml == "<p></p>" ||
      editorHtml == ""
    ) {
      toast.error("Please enter some content. Editor cannot be empty.");
      setIsLoading(false);
      return;
    }

    if (!imgUrl && !selectedImage) {
      setIsLoading(false);
      toast.error("Please select a banner image. Image cannot be empty.");
      return;
    }

    try {
      const checkIfSlugExists = await axiosInstance.get(`/post/${data.slug}`);
      if (postData?.slug !== data.slug && checkIfSlugExists?.data?.data) {
        toast.error("Slug already exists. Please take a different slug.");
        setIsLoading(false);
        return;
      }

      let banner_img = imgUrl;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage as Blob);
        formData.append("key", `${Date.now()}.jpg`);

        const bannerUploadRes = await axiosInstance.post(
          "/common/file-upload",
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );

        if (bannerUploadRes?.data?.data) {
          banner_img = bannerUploadRes?.data?.data;
        }
      }

      const updatePostData = {
        title: data?.title,
        banner_img,
        content: editorHtml,
        short_description: data?.short_description,
        meta_description: data?.meta_description,
        author_name: data?.author_name,
        slug: data?.slug,
        category_id: data?.category_id,
        tags: tagsInArray,
        meta_keywords: metaKeyWordsInArray,
      };

      const createPostRes = await axiosInstance.patch(
        `/post/${postData?.id}`,
        updatePostData
      );

      if (createPostRes?.data?.data) {
        toast.success("Post updated successfully.");
        form.reset();
        setImgUrl(null);
        setSelectedImage(null);
        reactQuillRef.current?.getEditor().setContents([]);
        setIsLoading(false);
        navigate(`/dashboard/posts/${updatePostData?.slug}`);
      }
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div>
      {isLoading && <FakeLoader />}
      {postData && (
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between">
                <h1 className="text-xl md:text-3xl font-semibold">
                  Update Post
                </h1>
                <Button type="submit" variant={`default`}>
                  Update
                </Button>
              </div>

              <div className="my-11 flex gap-5">
                <div className="flex-[70%]">
                  <div
                    className={`${
                      imgUrl ? "h-72" : "h-72"
                    } relative flex items-center justify-center bg-gray-100 border-2 border-gray-200 rounded-md`}
                  >
                    {imgUrl ? (
                      <div>
                        <img
                          src={imgUrl || ""}
                          alt="Selected"
                          className="h-44 md:h-72 w-full object-cover"
                        />
                      </div>
                    ) : (
                      <h1 className="text-2xl font-medium text-gray-500">
                        Blog Banner
                      </h1>
                    )}
                    <input
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      defaultValue={postData?.title}
                      name="title"
                      render={({ field }) => (
                        <div className="w-full flex-1">
                          <FormItem>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Enter Blog Title"
                                {...field}
                                className="mt-5 px-3 md:px-4 py-3 md:py-4 w-full text-base md:text-xl bg-gray-100 border-b-2 border-gray-200 rounded-md outline-none"
                              />
                            </FormControl>
                          </FormItem>

                          <FormMessage className="mt-3 text-red-500" />
                        </div>
                      )}
                    />
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
                        <button
                          className="ql-insertImage"
                          onClick={imageHandler}
                        >
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
                <div className="md:flex-[30%]">
                  <div className="py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">Category</h1>
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="category_id"
                        defaultValue={postData?.category_id}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="text-black font-medium outline-none">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="text-black font-medium">
                                {categoryData?.map((item) => (
                                  <SelectItem value={item?.id} key={item?.id}>
                                    {item?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="mt-3 text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="mt-3 py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">Tags</h1>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="tags"
                        defaultValue={postData?.tags.join(", ")}
                        render={({ field }) => (
                          <div className="w-full flex-1">
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="px-3 md:px-4 py-2 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md outline-none"
                                  type="text"
                                  placeholder="Enter Tags"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>

                            <FormMessage className="mt-3 text-red-500" />
                          </div>
                        )}
                      />
                    </div>
                    <p className="mt-3 text-sm text-black font-medium">
                      *Separate tags with commas.
                    </p>
                  </div>
                  <div className="mt-3 py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">Meta Keywords</h1>
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        defaultValue={postData?.meta_keywords?.join(", ")}
                        name="meta_keywords"
                        render={({ field }) => (
                          <div className="w-full flex-1">
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="px-3 md:px-4 py-2 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md outline-none"
                                  type="text"
                                  placeholder="Enter Meta Keywords"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>

                            <FormMessage className="mt-3 text-red-500" />
                          </div>
                        )}
                      />
                    </div>
                    <p className="mt-3 text-sm text-black font-medium">
                      *Separate keywords with commas.
                    </p>
                  </div>
                  <div className="mt-3 py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">
                      Short Description
                    </h1>

                    <FormField
                      control={form.control}
                      name="short_description"
                      defaultValue={postData?.short_description}
                      render={({ field }) => (
                        <div className="w-full flex-1">
                          <FormItem>
                            <FormControl>
                              <textarea
                                className="px-3 md:px-4 py-3 h-32 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
                                placeholder="Enter Short Description"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>

                          <FormMessage className="mt-3 text-red-500" />
                        </div>
                      )}
                    />
                  </div>
                  <div className="mt-3 py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">
                      Meta Description
                    </h1>

                    <FormField
                      control={form.control}
                      defaultValue={postData?.meta_description}
                      name="meta_description"
                      render={({ field }) => (
                        <div className="w-full flex-1">
                          <FormItem>
                            <FormControl>
                              <textarea
                                className="px-3 md:px-4 py-3 h-32 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
                                placeholder="Enter Short Description"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>

                          <FormMessage className="mt-3 text-red-500" />
                        </div>
                      )}
                    />
                  </div>
                  <div className="mt-3 py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">Author Name</h1>
                    <FormField
                      control={form.control}
                      defaultValue={postData?.author_name}
                      name="author_name"
                      render={({ field }) => (
                        <div className="w-full flex-1">
                          <FormItem>
                            <FormControl>
                              <Input
                                className="px-3 md:px-4 py-2 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
                                type="text"
                                placeholder="Enter Author Name"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>

                          <FormMessage className="mt-3 text-red-500" />
                        </div>
                      )}
                    />
                  </div>
                  <div className="mt-3 py-6 px-3 md:px-5 border-2 border-gray-300 rounded-sm">
                    <h1 className="mb-3 text-lg font-medium">Slug Name</h1>
                    <FormField
                      control={form.control}
                      name="slug"
                      defaultValue={postData?.slug}
                      render={({ field }) => (
                        <div className="w-full flex-1">
                          <FormItem>
                            <FormControl>
                              <Input
                                className="px-3 md:px-4 py-2 w-full text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 rounded-md resize-none outline-none"
                                type="text"
                                placeholder="Enter Slug Name"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>

                          <FormMessage className="mt-3 text-red-500" />
                        </div>
                      )}
                    />
                    <p className="mt-3 text-sm text-black font-medium">
                      *Slug name must be unique and use only lowercase letters
                      <br />
                      *Use hyphen (-) instead of space
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </Form>
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
