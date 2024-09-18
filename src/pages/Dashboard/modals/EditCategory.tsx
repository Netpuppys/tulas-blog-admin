import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
import { Edit } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter a valid category name.",
  }),
});

export function EditCategory({
  id,
  refetch,
  setRefetch,
  oldName,
}: {
  id: string;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  oldName: string;
}) {
  const [open, setOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: oldName,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.patch("/category/" + id, data);

      if (res?.data?.data) {
        toast.success("Category updated successfully");
        setRefetch(!refetch);
        setIsSubmitting(false);
        setOpen(false);
      }
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
      setIsSubmitting(false);
      setOpen(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          form.reset({ name: oldName });
        }
      }}
    >
      <DialogTrigger asChild>
        <Edit className="cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription className="pt-3 pb-2 font-medium">
            Enter the new name for the category.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mt-1 mb-4">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <div className="w-full flex-1">
                        <FormItem>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter Category Name"
                              {...field}
                              className="px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 border-b-2 border-gray-200 outline-none"
                            />
                          </FormControl>
                        </FormItem>

                        <FormMessage className="mt-3 text-red-500" />
                      </div>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant={"default"} type="submit">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  disabled={isSubmitting}
                  variant="default"
                  type="submit"
                  className="bg-green-500 hover:bg-green-500/90"
                >
                  Edit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
