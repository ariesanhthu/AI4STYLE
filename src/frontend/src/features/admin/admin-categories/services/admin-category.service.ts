import {
  CategoryTreeResponse,
  CategoryTreeItemWithLevel,
  CategoryInit,
  CategoryCreateRes,
  CategoryUpdateReq,
  CategoryUpdateRes,
  CategoryUpdateParams,
  CategoryDeleteParams,
  CategoryDeleteRes
} from "../types/category.type"
import { apiClient } from "@/lib/open-api-client"

// type CategoryTreeItemWithLevel =
//   Omit<CategoryTreeResponse[number], "childrens"> & {
//     childrens: CategoryTreeItemWithLevel[];
//     level: number;
//   };



function addLevel(categories: CategoryTreeResponse, level: number = 1, newCategories: CategoryTreeItemWithLevel[] = []): CategoryTreeItemWithLevel[] {
  categories.map((element) => {
    const family: CategoryTreeItemWithLevel[] = [];
    family.unshift({
      ...element,
      level: level,
      childrens: addLevel(element.childrens as CategoryTreeResponse, level + 1, family)
    })
    newCategories.push(...family)
  });


  return newCategories;
}

const categoryService = {
  async getAllCategory(): Promise<CategoryTreeItemWithLevel[]> {
    const response = await apiClient.GET('/shop/v1/admin/category/tree');
    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }
    const categories = response.data.data;

    const tree = addLevel(categories, 0, []);
    console.log(tree);
    return tree;
  },

  async addCategory(category: CategoryInit): Promise<CategoryCreateRes['data']> {
    const response = await apiClient.POST('/shop/v1/admin/category', {
      body: {
        ...category
      }
    });
    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data
  },

  async updateCategory(category: CategoryUpdateReq, id: CategoryUpdateParams['id'] | null | undefined): Promise<CategoryUpdateRes['data']> {
    if (!id) {
      throw new Error("No id provided");
    }

    const response = await apiClient.POST('/shop/v1/admin/category/{id}', {
      params: {
        path: {
          id: id
        }
      },

      body: {
        ...category
      }
    });
    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data
  },

  async deleteCategory(id: CategoryDeleteParams['id'] | null | undefined): Promise<CategoryDeleteRes['data']> {
    if (!id) {
      throw new Error("No id provided");
    }

    const response = await apiClient.DELETE('/shop/v1/admin/category/{id}', {
      params: {
        path: {
          id: id
        }
      }
    });
    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }

    return response.data.data
  },
}

export default categoryService
