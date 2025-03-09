import { Card, CardContent, CardHeader, CardTitle } from '#components/ui/card';
import { ActivityRing } from '#components/ui/activity-ring';
import { CompleteDailyQuest } from '@repo/db';
import { Badge } from '#components/ui/badge';
import { CircleDot } from 'lucide-react';

interface QuestActivityCardProps {
  title: string;
  dailyQuests: CompleteDailyQuest[];
  className?: string;
}

export const QuestActivityCard = ({
  title,
  dailyQuests,
  className,
}: QuestActivityCardProps) => {
  const total = dailyQuests.length;
  const completed = dailyQuests.filter(
    (dq) => dq.status === 'completed'
  ).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <Card className={className}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <CircleDot size={16} className='text-muted-foreground' />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex items-center gap-6'>
          <ActivityRing
            completed={completed}
            total={total}
            size='lg'
            showLabel
          />
          <div className='space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant='outline' className='font-normal'>
                {completed} completed
              </Badge>
              <Badge variant='outline' className='font-normal'>
                {total - completed} remaining
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              {total === 0
                ? 'No daily quests'
                : `${percentage}% completion rate`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
