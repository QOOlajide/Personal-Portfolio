"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackText?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackText = "Image coming soon",
  className,
  fill,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[var(--color-background-tertiary)] border border-[var(--color-border)] text-[var(--color-foreground-subtle)] text-sm",
          fill && "absolute inset-0",
          className
        )}
        style={!fill ? { width: props.width, height: props.height } : undefined}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
