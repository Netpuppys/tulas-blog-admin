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
import axiosInstance from "@/utils/axiosInstance";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

export function DeleteCategory({
  id,
  refetch,
  setRefetch,
}: {
  id: string;
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await axiosInstance.delete(`/category/${id}`);
      if (res?.data?.data) {
        toast.success(res?.data?.message);
        setRefetch(!refetch);
        setOpen(false);
      }
    } catch (err: unknown) {
      const error = err as { response: { data: { message: string } } };
      toast.error(error?.response?.data?.message);
      setRefetch(!refetch);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="h-7 w-7 text-red-600" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-red-100">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription className="pt-2 py-5 font-medium text-red-800">
            Are you sure you want to complete this action? This is a destructive
            change and it cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} variant="destructive" type="submit">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
