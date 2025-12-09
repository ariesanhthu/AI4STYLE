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
import { Category, CategoryResponse } from "../types/category.type"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  data: CategoryResponse['items'] | []
}

export function CategoryDialog({
  data,
  open,
  onOpenChange,
  category,
}: CategoryDialogProps) {

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
              defaultValue={category?.name}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input
              id="slug"
              defaultValue={category?.slug}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              Parent
            </Label>
            <Select value={category?.parentId ?? undefined}>
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
              defaultValue={category?.icon ?? ""}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => onOpenChange(false)}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
