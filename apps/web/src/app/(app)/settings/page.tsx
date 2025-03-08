import ModeToggle from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';
import { UserButton } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <section className='flex flex-col flex-1 p-2 space-y-4 h-screen overflow-hidden slim-scroll'>
      <h1>Settings</h1>
      <div className='flex flex-col space-y-4 max-w-64'>
        <div className='flex flex-col space-y-2'>
          <h2>Theme</h2>
          <Separator />
        </div>
        <ModeToggle />
        <div className='flex flex-col space-y-2'>
          <h2>Account</h2>
          <Separator />
        </div>
        <UserButton />
      </div>
    </section>
  );
}
