import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const CouncilEmblem: React.FC<EmblemProps> = ({ className = '', size = 48 }) => {
  return (
    <img
      src="/assets/aistudio/image_73a4f48b.png"
      alt="نشان رسمی سازمان نظام پزشکی استان ایلام"
      width={size}
      height={size}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`object-contain shrink-0 ${className}`}
    />
  );
};
