import {
  CategoryAdminController_getAllCategories_Params,
  CategoryAdminController_getAllCategories_Request,
  CategoryAdminController_getAllCategories_Response,
  CategoryAdminController_getAllCategoriesInTreeFormat_Response,
  CategoryAdminController_createCategory_Params,
  CategoryAdminController_createCategory_Request,
  CategoryAdminController_updateCategory_Request,
  CategoryAdminController_createCategory_Response,
  CategoryAdminController_updateCategory_Response,
  CategoryAdminController_updateCategory_Params,
  CategoryAdminController_deleteCategory_Params,
  CategoryAdminController_deleteCategory_Response,
} from "@/lib/open-api-client/type.admin";

export type CategoryParams = CategoryAdminController_getAllCategories_Params['query'];
export type CategoryRequest = CategoryAdminController_getAllCategories_Request;
export type CategoryResponse = CategoryAdminController_getAllCategories_Response['data'];
export type Category = CategoryResponse['items'][number];

export type CategoryTreeResponse = CategoryAdminController_getAllCategoriesInTreeFormat_Response['data']

export type CategoryTreeItemWithLevel = CategoryTreeResponse[number] & {
  level: number;
  childrens: CategoryTreeItemWithLevel[];
};

export type CategoryDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryTreeItemWithLevel | null
  data: CategoryTreeItemWithLevel[] | []
  onSuccess: () => void
}


export type CategoryCreateReq = CategoryAdminController_createCategory_Request
export type CategoryInit = CategoryCreateReq & { id: string | null | undefined }

export type CategoryCreateRes = CategoryAdminController_createCategory_Response

export type CategoryUpdateReq = CategoryAdminController_updateCategory_Request
export type CategoryUpdateParams = CategoryAdminController_updateCategory_Params['path']
export type CategoryUpdateRes = CategoryAdminController_updateCategory_Response

export type CategoryDeleteParams = CategoryAdminController_deleteCategory_Params['path']
export type CategoryDeleteRes = CategoryAdminController_deleteCategory_Response
