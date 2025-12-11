import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CategoryDialogProps } from "../types/category.type"
import { useCategoryDialog } from "../hooks/use-admin-category"

export function CategoryDialog({
  data,
  open,
  category,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) {

  const { cur_category, setCurCategory, handleAdd, handleUpdate } = useCategoryDialog(category)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={cur_category?.name ?? ""}
              onChange={(e) => setCurCategory({ ...cur_category, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              value={cur_category?.slug ?? ""}
              onChange={(e) => setCurCategory({ ...cur_category, slug: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              Parent
            </Label>
            <Select value={cur_category?.parentId ?? undefined}
              onValueChange={(value) => setCurCategory({ ...cur_category, parentId: value })}>
              <SelectTrigger className="col-sp`an-3">
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                {data.map((category) => (
                  <SelectItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon
            </Label>
            <Input
              id="icon"
              value={cur_category?.icon ?? ""}
              onChange={(e) => setCurCategory({ ...cur_category, icon: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"
            onClick={async () => {
              if (cur_category?.id) {
                await handleUpdate()
                onSuccess()
              } else {
                await handleAdd()
                onSuccess()
              }
              onOpenChange(false)
            }}>{category ? "Update" : "Add"} Category</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
