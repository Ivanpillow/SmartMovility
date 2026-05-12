"use client";

import { motion } from 'motion/react';
import { getStatusColor } from '@/types/parking';
import { ParkingStatus } from '@/types/parking';

interface OccupancyIndicatorProps {
  percentage: number;
  status: ParkingStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function OccupancyIndicator({ 
  percentage, 
  status, 
  size = 'md',
  showLabel = true 
}: OccupancyIndicatorProps) {
  const color = getStatusColor(status);
  
  const sizes = {
    sm: { height: 'h-1.5', text: 'text-xs' },
    md: { height: 'h-2', text: 'text-sm' },
    lg: { height: 'h-3', text: 'text-base' }
  };
  
  return (
    <div className="w-full">
      <div className={`w-full ${sizes[size].height} bg-muted rounded-full overflow-hidden`}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`${sizes[size].height} rounded-full`}
          style={{ backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between mt-1">
          <span className={`${sizes[size].text} text-muted-foreground`}>Ocupación</span>
          <span className={`${sizes[size].text} font-semibold`} style={{ color }}>
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}
