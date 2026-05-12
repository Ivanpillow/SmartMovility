import { ParkingStatus, getStatusColor, getStatusText } from '@/types/parking';

interface StatusBadgeProps {
  status: ParkingStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const text = getStatusText(status);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size]}`}
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <span className="font-medium">{text}</span>
    </div>
  );
}
