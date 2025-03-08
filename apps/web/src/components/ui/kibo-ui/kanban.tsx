'use client';

import { Card } from '#components/ui/card';
import { Checkbox } from '#components/ui/checkbox';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { getDueDateColor, formatDueDate } from '#lib/utils';
import { cn } from '#lib/utils';

export type BoardName = 'open' | 'completed';
export type Status = {
  id: string;
  name: BoardName;
  color?: string;
};

export type Feature = {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: Status;
};

export type KanbanBoardProps = {
  id: Status['id'];
  children: ReactNode;
  className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      className={cn(
        'flex flex-col flex-1 max-h-full min-w-[17.5rem] box-border text-xs transition-all',
        isOver ? 'outline-primary' : 'outline-transparent',
        className
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  );
};
export interface KanbanCardProps {
  id: string;
  name: string;
  index: number;
  parent: BoardName;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Record<string, any>;
  className?: string;
  draggable?: boolean; // New prop to control drag behavior
}

export const KanbanCard = ({
  id,
  name,
  index,
  parent,
  children,
  data,
  className,
  draggable = true, // default to true
}: KanbanCardProps) => {
  // Define a no-op function for the disabled state.
  const noOp = () => {};

  // Only initialize draggable behavior if enabled.
  const { attributes, listeners, setNodeRef, transform, isDragging } = draggable
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useDraggable({
        id,
        data: { ...data, parent, index },
      })
    : {
        attributes: {},
        listeners: {},
        setNodeRef: noOp,
        transform: null,
        isDragging: false,
      };

  return (
    <Card
      className={cn(
        'rounded-md p-3 shadow-xs',
        isDragging ? 'cursor-grabbing' : 'cursor-pointer',
        draggable && 'hover:border-hover',
        !draggable && 'opacity-50 cursor-default',
        className
      )}
      style={{
        transform: transform
          ? `translateX(${transform.x}px) translateY(${transform.y}px)`
          : 'none',
      }}
      // Only attach drag event handlers if draggable is true.
      {...(draggable ? listeners : {})}
      {...(draggable ? attributes : {})}
      ref={draggable ? setNodeRef : undefined}
    >
      {children ?? <p className='m-0 font-medium text-sm'>{name}</p>}
    </Card>
  );
};

export type KanbanCardsProps = {
  children: ReactNode;
  className?: string;
};

export const KanbanCards = ({ children, className }: KanbanCardsProps) => (
  <div
    className={cn(
      'flex flex-col gap-2 p-2 box-border scroll-p-3 min-h-0 overflow-x-hidden overflow-y-auto',
      className
    )}
  >
    {children}
  </div>
);

export type KanbanHeaderProps =
  | {
      children: ReactNode;
    }
  | {
      name: Status['name'];
      color?: Status['color'];
      className?: string;
      count: number;
    };

export const KanbanHeader = (props: KanbanHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div
      className={cn(
        'w-full h-11 flex shrink-0 items-center gap-2 border-b',
        props.className
      )}
    >
      {props.color && (
        <div
          className='h-2 w-2 rounded-full'
          style={{ backgroundColor: props.color }}
        />
      )}
      <p className='m-0 font-semibold'>{props.name}</p>
      <p className='text-muted-foreground'>{props.count}</p>
    </div>
  );

export type KanbanProviderProps = {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
  className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const KanbanCardOverlay = ({ activeCard }: { activeCard: any }) => {
  return (
    <DragOverlay>
      {activeCard ? (
        <div style={{ width: '100%' }}>
          <KanbanCard
            id={activeCard.id}
            name={activeCard.title}
            parent={activeCard.status} // adjust as needed
            index={0} // index is not needed for the overlay copy
            data={activeCard}
            className='flex justify-between items-center opacity-75' // You can add styles for the overlay
          >
            <div className='flex space-x-2 text-muted-foreground'>
              <Checkbox id='completed' disabled />
              <div className='flex flex-col space-y-2'>
                <div className='flex flex-col space-y-0.5'>
                  <label htmlFor='complete' className='text-sm text-foreground'>
                    {activeCard.title}
                  </label>
                  {activeCard.description && (
                    <p className='text-xs'>{activeCard.description}</p>
                  )}
                </div>
                {activeCard.dueDate && (
                  <div
                    className={`flex space-x-0.5 items-center ${getDueDateColor(
                      activeCard.dueDate
                    )}`}
                  >
                    <Calendar size={10} />
                    <p className='text-xs capitalize'>
                      {formatDueDate(activeCard.dueDate)}
                    </p>
                    {activeCard.recurrence &&
                      activeCard.recurrence !== 'none' && (
                        <RefreshCw size={10} />
                      )}
                  </div>
                )}
              </div>
            </div>
          </KanbanCard>
        </div>
      ) : null}
    </DragOverlay>
  );
};

export const KanbanProvider = ({
  children,
  onDragEnd,
  className,
}: KanbanProviderProps) => {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  // Track the active draggable item's id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activeCard, setActiveCard] = useState<any>(null);

  const id = useId();
  return (
    <DndContext
      id={id}
      collisionDetection={rectIntersection}
      onDragStart={({ active }) => setActiveCard(active.data.current)}
      onDragEnd={(event) => {
        onDragEnd(event);
        setActiveCard(null);
      }}
      onDragCancel={() => setActiveCard(null)}
      sensors={sensors}
    >
      <div
        className={cn(
          'flex flex-1 space-x-3 overflow-x-auto box-border h-full max-w-[40rem]',
          className
        )}
      >
        {children}
      </div>

      <KanbanCardOverlay activeCard={activeCard} />
    </DndContext>
  );
};
