import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LevelProgressCardProps {
  currentXP: number;
  nextLevelXP: number;
}

export function LevelProgressCard({
  currentXP,
  nextLevelXP,
}: LevelProgressCardProps) {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Level Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className='w-full' />
        <div className='mt-2 text-sm text-muted-foreground'>
          {currentXP} / {nextLevelXP} XP to next level
        </div>
      </CardContent>
    </Card>
  );
}
