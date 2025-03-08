import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '#/lib/api/categories/mutations';
import { protectedProcedure, router } from '../trpc';
import {
  categoryIdSchema,
  insertCategoryParams,
  updateCategoryParams,
} from '#/db/schema/categories';
import { getCategories } from '#/lib/api/categories/queries';

export const categoriesRouter = router({
  createCategory: protectedProcedure
    .input(insertCategoryParams)
    .mutation(async ({ input }) => {
      return createCategory(input);
    }),
  updateCategory: protectedProcedure
    .input(updateCategoryParams)
    .mutation(async ({ input }) => {
      return updateCategory(input.id!, input);
    }),
  deleteCategory: protectedProcedure
    .input(categoryIdSchema)
    .mutation(async ({ input }) => {
      return deleteCategory(input.id);
    }),
  getAll: protectedProcedure.query(async () => {
    return getCategories();
  }),
});
