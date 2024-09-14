import { Button } from "@/components/ui/button";
import { IoMail } from "react-icons/io5";
import { MdKey } from "react-icons/md";
import { toast } from "sonner";

const ChangePassword = () => {
  return (
    <div>
      <div className="px-5 md:px-0 flex items-center justify-center">
        <div>
          <h1 className="mb-5 text-3xl text-center font-semibold">
            Change Password
          </h1>
          <h1 className="text-base md:text-lg font-normal">
            Enter credentials below to change password.
          </h1>
          <div>
            <div className="my-5 px-3 flex justify-between items-center bg-[#F0F0F0] border-2 rounded-sm">
              <div className="w-8">
                <IoMail className="text-xl" />
              </div>
              <input
                type="text"
                placeholder="Email"
                className="flex-1 py-2 bg-[#F0F0F0] outline-none placeholder-gray-500"
              />
            </div>
            <div className="my-5 px-3 flex justify-between items-center bg-[#F0F0F0] border-2 rounded-sm">
              <div className="w-8">
                <MdKey className="text-xl" />
              </div>
              <input
                type="password"
                placeholder="Old Password"
                className="flex-1 py-2 bg-[#F0F0F0] outline-none placeholder-gray-500"
              />
            </div>
            <div className="my-5 px-3 flex justify-between items-center bg-[#F0F0F0] border-2 rounded-sm">
              <div className="w-8">
                <MdKey className="text-xl" />
              </div>
              <input
                type="password"
                placeholder="New Password"
                className="flex-1 py-2 bg-[#F0F0F0] outline-none placeholder-gray-500"
              />
            </div>
            <div className="text-center">
              <Button onClick={() => toast.success("Password Changed")}>
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
