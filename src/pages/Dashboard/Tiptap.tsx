import axiosInstance from "@/utils/axiosInstance";
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
import { useCallback } from "react";
import { LuLayoutList } from "react-icons/lu";
import { RxQuote } from "react-icons/rx";

import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { FaTableCellsLarge } from "react-icons/fa6";
import { GrFormNextLink, GrFormPreviousLink } from "react-icons/gr";
import {
    PiColumnsPlusLeft,
    PiColumnsPlusRight,
    PiRowsPlusBottom,
    PiRowsPlusTop
} from "react-icons/pi";
import { RiH1, RiH2, RiListOrdered2 } from "react-icons/ri";
import { TbColumnRemove, TbRowRemove, TbTableMinus } from "react-icons/tb";

import { MdImage } from "react-icons/md";
import "./Tiptap.css";

// Add all required extensions here
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

const Tiptap = () => {
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

  console.log(editor?.getHTML());

  if (!editor) {
    return null; // Do not render if the editor is not ready
  }

  return (
    <div className="editor-container">
      {/* Custom Toolbar */}
      <div className="px-2 py-3 flex items-center bg-gray-200 gap-5 border-2 border-gray-200">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={isActive("paragraph") ? "active" : ""}
        >
          <h1 className="text-[1.5rem] font-medium">P</h1>
          {/* <PiParagraphBold  /> */}
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={isActive("bold") ? "active" : ""}
        >
          <FaBold className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={isActive("italic") ? "active" : ""}
        >
          <FaItalic className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={isActive("underline") ? "active" : ""}
        >
          <FaUnderline className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={isActive("strike") ? "active" : ""}
        >
          <FaStrikethrough className="h-5 w-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={isActive("heading", { level: 1 }) ? "active" : ""}
        >
          <RiH1 className="h-6 w-6" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={isActive("heading", { level: 2 }) ? "active" : ""}
        >
          <RiH2 className="h-6 w-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={isActive("bulletList") ? "active" : ""}
        >
          <LuLayoutList className="h-5 w-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={isActive("orderedList") ? "active" : ""}
        >
          <RiListOrdered2 className="h-6 w-6" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={isActive("blockquote") ? "active" : ""}
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
          <MdImage className="h-6 w-6" />
        </label>
        <button
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <FaTableCellsLarge className="h-5 w-5" />
        </button>
        <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
          <PiColumnsPlusLeft className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
          <PiColumnsPlusRight className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().deleteColumn().run()}>
          <TbColumnRemove className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().addRowBefore().run()}>
          <PiRowsPlusTop className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().addRowAfter().run()}>
          <PiRowsPlusBottom className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().deleteRow().run()}>
          <TbRowRemove className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().deleteTable().run()}>
          <TbTableMinus className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().mergeCells().run()}>
          <AiOutlineMergeCells className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().splitCell().run()}>
          <AiOutlineSplitCells className="h-6 w-6" />
        </button>

        <button onClick={() => editor.chain().focus().goToNextCell().run()}>
          <GrFormNextLink className="h-6 w-6" />
        </button>
        <button onClick={() => editor.chain().focus().goToPreviousCell().run()}>
          <GrFormPreviousLink className="h-6 w-6" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent
        className="prose prose-lg max-w-none border-2 border-gray-300"
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
