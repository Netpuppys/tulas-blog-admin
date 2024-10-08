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
import { ICategoryType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";
import FakeLoader from "@/utils/FakeLoader";
import { zodResolver } from "@hookform/resolvers/zod";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Align from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import { LuLayoutList } from "react-icons/lu";
import { MdImage } from "react-icons/md";
import {
  PiColumnsPlusLeft,
  PiColumnsPlusRight,
  PiRowsPlusBottom,
  PiRowsPlusTop,
} from "react-icons/pi";
import { RiH1, RiH2, RiListOrdered2 } from "react-icons/ri";
import { RxQuote } from "react-icons/rx";
import { TbColumnRemove, TbRowRemove, TbTableMinus } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import "./Tiptap.css";

const FormSchema = z.object({
  title: z.string().min(1, {
    message: "Please enter a title name.",
  }),
  meta_title: z.string().min(1, {
    message: "Please enter a meta title.",
  }),
  short_description: z.string(),
  meta_description: z.string(),
  tags: z.string(),
  meta_keywords: z.string(),
  slug: z.string().min(1, {
    message: "Please enter a slug.",
  }),
  author_name: z.string(),
  category_id: z.string().min(1, {
    message: "Please select a category.",
  }),
});

const extensions = [
  StarterKit,
  Paragraph,
  Heading.configure({ levels: [1, 2] }),
  Bold,
  Italic,
  Underline,
  Strike,
  Image,
  Blockquote,
  ListItem,
  BulletList,
  OrderedList,
  Align,
  Superscript,
  Subscript,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
];

const CreatePost = () => {
  const editor = useEditor({
    extensions,
    content: "",
  });

  // Utility function to check if an editor command is active
  const isActive = useCallback(
    (format: string) => editor?.isActive(format) || false,
    [editor]
  );

  const uploadImageToS3 = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("key", `${Date.now()}.jpg`);

      const response = await axiosInstance.post(
        "/common/file-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Return the S3 URL from the response
      return response?.data?.data;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      try {
        const imageUrl = await uploadImageToS3(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error("Failed to upload and insert image:", error);
      }
    }
  };

  const navigate = useNavigate();

  const [categoryData, setCategoryData] = useState<ICategoryType[] | []>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      setIsLoading(true);
      const fetchCategories = async () => {
        const res = await axiosInstance.get("/category");
        if (res?.data?.data) {
          setCategoryData(res?.data?.data);
          setIsLoading(false);
        }
      };

      fetchCategories();
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  }, []);

  // Function to add unique IDs to headings on submission
  const addHeadingIds = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const headings = tempDiv.querySelectorAll("h1, h2");

    // Assign unique IDs to each heading
    headings.forEach((heading, index) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const text = heading.innerText.toLowerCase().replace(/\s+/g, "-");
      heading.setAttribute("id", `${text}-${index}`);
    });

    return tempDiv.innerHTML;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      meta_title: "",
      short_description: "",
      meta_description: "",
      tags: "",
      meta_keywords: "",
      slug: "",
      author_name: "",
      category_id: "",
    },
  });

  const [selectedImage, setSelectedImage] = useState<unknown | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

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

    const editorHtml = editor?.getHTML();

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

    if (!selectedImage) {
      setIsLoading(false);
      toast.error("Please select a banner image. Image cannot be empty.");
      return;
    }

    try {
      const checkIfSlugExists = await axiosInstance.get(`/post/${data.slug}`);
      if (checkIfSlugExists?.data?.data) {
        toast.error("Slug already exists. Please choose a different slug.");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedImage as Blob);
      formData.append("key", `${Date.now()}.jpg`);

      let banner_img = "";

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

      const contentWithIds = addHeadingIds(editorHtml as string);

      const createPostData = {
        title: data?.title,
        meta_title: data?.meta_title,
        banner_img,
        content: contentWithIds,
        short_description: data?.short_description,
        meta_description: data?.meta_description,
        author_name: data?.author_name,
        slug: data?.slug,
        category_id: data?.category_id,
        tags: tagsInArray,
        meta_keywords: metaKeyWordsInArray,
      };

      const createPostRes = await axiosInstance.post(
        "/post/create-post",
        createPostData
      );

      if (createPostRes?.data?.data) {
        toast.success("Post created successfully.");
        form.reset();
        setImgUrl(null);
        setSelectedImage(null);
        setIsLoading(false);
        navigate("/dashboard/all-posts");
      }
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  }

  if (!editor) {
    setIsLoading(true);
    return null;
  }

  return (
    <div>
      {isLoading && <FakeLoader />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-3xl font-semibold">
                Create New Post
              </h1>
              <Button variant={`default`}>Create</Button>
            </div>
            <div className="mt-10 flex flex-col md:flex-row gap-5">
              <div className="md:flex-[70%]">
                <div
                  className={`${
                    selectedImage ? "h-72" : "h-72"
                  } relative flex items-center justify-center bg-gray-100 border-2 border-gray-200 rounded-md`}
                >
                  {selectedImage ? (
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
                <div>
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <div className="w-full flex-1">
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Meta Title"
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
                  <div className="editor-container">
                    {/* Custom Toolbar */}
                    <div className="px-2 py-3 flex gap-y-3 gap-x-2 flex-wrap items-center bg-gray-200 border-2 border-gray-200">
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().setParagraph().run()
                        }
                        className={`${
                          isActive("paragraph")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-[0.5px]`}
                      >
                        <h1 className="text-[1.46rem] font-medium">P</h1>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleBold().run()
                        }
                        className={`${
                          isActive("bold")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <FaBold className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleItalic().run()
                        }
                        className={`${
                          isActive("italic")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <FaItalic className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleUnderline().run()
                        }
                        className={`${
                          isActive("underline")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <FaUnderline className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleStrike().run()
                        }
                        className={`${
                          isActive("strike")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <FaStrikethrough className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        className={`${
                          isActive("heading") &&
                          editor.isActive("heading", { level: 1 })
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <RiH1 className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={`${
                          isActive("heading") &&
                          editor.isActive("heading", { level: 2 })
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <RiH2 className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleBulletList().run()
                        }
                        className={`${
                          isActive("bulletList")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <LuLayoutList className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleOrderedList().run()
                        }
                        className={`${
                          isActive("orderedList")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <RiListOrdered2 className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          editor.chain().focus().toggleBlockquote().run()
                        }
                        className={`${
                          isActive("blockquote")
                            ? "active bg-purple-500/70 rounded-sm"
                            : ""
                        } px-2 py-2`}
                      >
                        <RxQuote className="h-6 w-6" />
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <MdImage className="mx-2 h-6 w-6" />
                      </label>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .insertTable({
                              rows: 3,
                              cols: 3,
                              withHeaderRow: true,
                            })
                            .run()
                        }
                      >
                        <FaTableCellsLarge className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().addColumnBefore().run()
                        }
                      >
                        <PiColumnsPlusLeft className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().addColumnAfter().run()
                        }
                      >
                        <PiColumnsPlusRight className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().deleteColumn().run()
                        }
                      >
                        <TbColumnRemove className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().addRowBefore().run()
                        }
                      >
                        <PiRowsPlusTop className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().addRowAfter().run()
                        }
                      >
                        <PiRowsPlusBottom className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                      >
                        <TbRowRemove className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().deleteTable().run()
                        }
                      >
                        <TbTableMinus className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().mergeCells().run()
                        }
                      >
                        <AiOutlineMergeCells className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() => editor.chain().focus().splitCell().run()}
                      >
                        <AiOutlineSplitCells className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().goToNextCell().run()
                        }
                      >
                        <GrFormNextLink className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        className="px-2"
                        onClick={() =>
                          editor.chain().focus().goToPreviousCell().run()
                        }
                      >
                        <GrFormPreviousLink className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Editor Content */}
                    <EditorContent
                      className="prose max-w-none border-2 border-gray-300"
                      editor={editor}
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
                  <h1 className="mb-3 text-lg font-medium">Meta Description</h1>

                  <FormField
                    control={form.control}
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePost;
