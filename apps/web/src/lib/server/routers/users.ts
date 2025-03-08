import { getUser } from "@/lib/api/users/queries";
import { protectedProcedure, router } from "@/lib/server/trpc";

export const usersRouter = router({
  getUser: protectedProcedure.query(async () => {
    return getUser();
  }),
});
