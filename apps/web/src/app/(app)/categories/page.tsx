import { trpc } from '@/lib/trpc/api';

export default async function CategoriesPage() {
  const [categories] = await Promise.all([trpc.categories.getAll()]);
  return (
    <section className='flex flex-col flex-1 p-2 space-y-4 h-screen overflow-hidden slim-scroll'>
      <h1>Categories</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
    </section>
  );
}
