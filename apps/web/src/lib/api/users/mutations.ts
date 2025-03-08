import { db } from '#db/drizzle';
import {
  insertUserSchema,
  NewUserParams,
  UpdateUserParams,
  updateUserSchema,
  UserId,
  userIdSchema,
  users,
} from '#db/schema/users';
import { eq } from 'drizzle-orm';

export const createUser = async (user: NewUserParams) => {
  const newUser = insertUserSchema.parse({ ...user });
  try {
    const result = await db.insert(users).values(newUser);
    return result;
  } catch (err) {
    const message = (err as Error).message ?? 'Error creating user';
    console.error(message);
    throw { error: message };
  }
};

export const updateUser = async (id: UserId, user: UpdateUserParams) => {
  const { id: userId } = userIdSchema.parse({ id });

  const newUser = updateUserSchema.parse({
    ...user,
  });
  try {
    const result = await db
      .update(users)
      .set({ ...newUser, updatedAt: new Date().toISOString() })
      .where(eq(users.id, userId));
    return result;
  } catch (err) {
    const message = (err as Error).message ?? 'Error updating user';
    console.error(message);
    throw { error: message };
  }
};

export const deleteUser = async (id: UserId) => {
  const { id: userId } = userIdSchema.parse({ id });

  try {
    await db.delete(users).where(eq(users.id, userId));
  } catch (err) {
    const message = (err as Error).message ?? 'Error deleting user';
    console.error(message);
    throw { error: message };
  }
};
