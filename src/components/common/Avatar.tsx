import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClass = size === 'sm' ? 'avatar-sm' : size === 'lg' ? 'avatar-lg' : size === 'xl' ? 'avatar-xl' : '';

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        className={`avatar ${sizeClass} ${className}`}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className={`avatar ${sizeClass} ${className}`}>
      {getInitials(name || 'User')}
    </div>
  );
};
