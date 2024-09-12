import { FaRegClock } from "react-icons/fa";

const DisplayPost = () => {
  return (
    <div className="py-10 flex flex-col-reverse md:flex-row items-center border-b-2 border-gray-200">
      <div className="md:flex-[80%]">
        <div className="mt-3 md:mt-0 mb-2 flex items-center gap-6 md:gap-10">
          <h1 className="text-base md:text-lg font-bold">John Doe</h1>
          <div className="flex items-center gap-3">
            <FaRegClock className="text-xl" />
            <h1 className="text-base md:text-lg">5th August 2024</h1>
          </div>
        </div>
        <h1 className="text-xl md:text-3xl font-semibold hover:underline cursor-pointer">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </h1>
        <h1 className="mt-2 text-sm md:text-lg font-normal">
          Lorem ipsum dolor sit amet.
        </h1>
        <div className="mt-4 flex items-center gap-2">
          <h1 className="px-3 md:px-4 py-1 text-sm md:text-base bg-[#F0F0F0] hover:bg-[#F0F0F0]/70 cursor-pointer font-medium border-2 rounded-[30px]">
            Tag 1
          </h1>
          <h1 className="px-3 md:px-4 py-1 text-sm md:text-base bg-[#F0F0F0] hover:bg-[#F0F0F0]/70 cursor-pointer font-medium border-2 rounded-[30px]">
            Tag 2
          </h1>
          <h1 className="px-3 md:px-4 py-1 text-sm md:text-base bg-[#F0F0F0] hover:bg-[#F0F0F0]/70 cursor-pointer font-medium border-2 rounded-[30px]">
            Tag 3
          </h1>
        </div>
      </div>

      <div className="md:flex-[20%]">
        <img
          className="h-40 md:h-44 w-screen md:w-72 object-cover rounded-md"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVyA46fENRd-zet6YYgMrPBkolIbsUjnyR-Q&s"
          alt="blog"
        />
      </div>
    </div>
  );
};

export default DisplayPost;
