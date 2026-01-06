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
import { Spinner } from "@/components/ui/spinner"

export function CategoryDialog({
  data,
  open,
  category,
  onOpenChange,
  onSuccess,
}: CategoryDialogProps) {

  const { cur_category, setCurCategory, handleAdd, handleUpdate, isLoading, isError, error } = useCategoryDialog(category)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
            <Spinner className="size-8" />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>{category ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tên
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
              Danh mục cha
            </Label>
            <Select value={cur_category?.parentId ?? undefined}
              onValueChange={(value) => setCurCategory({ ...cur_category, parentId: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Chọn danh mục cha" />
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
              Biểu tượng
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
            disabled={isLoading}
            onClick={async () => {
              if (cur_category?.id) {
                await handleUpdate()
                onSuccess()
              } else {
                await handleAdd()
                onSuccess()
              }
              onOpenChange(false)
            }}>{category ? "Cập nhật" : "Thêm"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

