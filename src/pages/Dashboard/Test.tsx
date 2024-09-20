import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Test = () => {
  const [editorValue, setEditorValue] = useState("");

  console.log(editorValue);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "subscript", "superscript"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
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
    "align",
    "link",
    "image",
    "blockquote",
    "code-block",
    "check",
  ];

  return (
    <div>
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
  );
};

export default Test;
