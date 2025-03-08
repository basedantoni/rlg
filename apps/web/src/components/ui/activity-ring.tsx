import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface ActivityRingProps {
  completed: number;
  total: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const strokeWidths = {
  sm: 2,
  md: 3,
  lg: 4,
};

export const ActivityRing = ({
  completed,
  total,
  size = "md",
  showLabel = false,
  className,
}: ActivityRingProps) => {
  const percentage = total === 0 ? 0 : (completed / total) * 100;
  const radius = size === "sm" ? 15 : size === "md" ? 22 : 30;
  const strokeWidth = strokeWidths[size];
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color based on completion percentage
  const getColor = () => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const tooltipContent = `${completed} of ${total} completed (${Math.round(
    percentage
  )}%)`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "relative inline-flex items-center justify-center",
              sizes[size],
              className
            )}
          >
            {/* Background circle */}
            <svg className="absolute" width="100%" height="100%">
              <circle
                className="text-gray-200 dark:text-gray-800"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50%"
                cy="50%"
              />
            </svg>
            {/* Progress circle */}
            <svg className="absolute -rotate-90" width="100%" height="100%">
              <circle
                className={cn("transition-all duration-300", getColor())}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r={radius}
                cx="50%"
                cy="50%"
              />
            </svg>
            {showLabel && (
              <span className="text-xs font-medium">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
