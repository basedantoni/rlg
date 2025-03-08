'use client';

import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { useCopyToClipboard } from '@uidotdev/usehooks';

export const CopyableArticle = ({
  label,
  text,
}: {
  label: string;
  text: string;
}) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedText, setHasCopiedText] = useState(false);

  const handleCopy = () => {
    copyToClipboard(text);
    setHasCopiedText(true);
    toast.success('Copied to clipboard');

    setTimeout(() => {
      setHasCopiedText(false);
    }, 4000);
  };

  return (
    <article className='flex items-center gap-2'>
      <pre>
        <Button disabled={hasCopiedText} variant='outline' onClick={handleCopy}>
          Share {hasCopiedText ? <Check /> : <Copy />}
        </Button>
      </pre>
    </article>
  );
};
