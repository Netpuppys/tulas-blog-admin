import { LoaderCircle } from "lucide-react";

const FakeLoader = () => {
  return (
    <div>
      <div className="fixed inset-0 bg-white/75 w-screen h-screen flex justify-center items-center z-[9999]">
        <LoaderCircle className="h-11 w-11 object-contain animate-spin" />
      </div>
    </div>
  );
};

export default FakeLoader;
