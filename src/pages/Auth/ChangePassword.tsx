import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMail } from "react-icons/io5";
import { MdKey } from "react-icons/md";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  oldPassword: z.string().min(1, {
    message: "Please enter a valid password.",
  }),
  newPassword: z.string().min(1, {
    message: "Please enter a valid password.",
  }),
});

const ChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data?.oldPassword === data?.newPassword) {
      toast.error("New password cannot be same as old password");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post("/auth/change-password", data);
      if (res?.data?.success) {
        toast.success("Password changed successfully");
        setIsSubmitting(false);
        form.reset();
      }
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="px-5 md:px-0 flex items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <h1 className="mb-5 text-3xl text-center font-semibold">
                Change Password
              </h1>
              <h1 className="text-base md:text-lg font-normal">
                Enter credentials below to change password.
              </h1>
              <div>
                <div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <div>
                        <div className="my-5 px-3 flex justify-between items-center bg-[#F0F0F0] border-2 rounded-sm">
                          <div className="w-8">
                            <IoMail className="text-xl" />
                          </div>
                          <FormItem className="w-full flex-1 outline-none ring-0 focus:ring-0">
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="Email"
                                {...field}
                                className="py-2 bg-[#F0F0F0] !border-0 outline-none placeholder-gray-500"
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        <FormMessage className="mt-[-10px] text-red-500" />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <div>
                        <div className="my-5 px-3 flex justify-between items-center bg-[#F0F0F0] border-2 rounded-sm">
                          <div className="w-8">
                            <MdKey className="text-xl" />
                          </div>
                          <FormItem className="w-full flex-1 outline-none ring-0 focus:ring-0">
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                                className="py-2 bg-[#F0F0F0] !border-0 outline-none placeholder-gray-500"
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        <FormMessage className="mt-[-10px] mb-5 text-red-500" />
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <div>
                        <div className="my-5 px-3 flex justify-between items-center bg-[#F0F0F0] border-2 rounded-sm">
                          <div className="w-8">
                            <MdKey className="text-xl" />
                          </div>
                          <FormItem className="w-full flex-1 outline-none ring-0 focus:ring-0">
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Password"
                                {...field}
                                className="py-2 bg-[#F0F0F0] !border-0 outline-none placeholder-gray-500"
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                        <FormMessage className="mt-[-10px] mb-5 text-red-500" />
                      </div>
                    )}
                  />

                  <div className="text-center">
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant={"default"}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
