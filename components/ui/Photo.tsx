import Image from "next/image";
import { PhotoPlaceholder, type PhotoPlaceholderProps } from "@/components/ui/PhotoPlaceholder";
import { getPublicUrl } from "@/lib/storage";
import { cn } from "@/lib/cn";

export type PhotoProps = PhotoPlaceholderProps & {
  path?: string | null;
  alt: string;
};

export function Photo({ path, alt, aspect = "4/3", rounded = "8px", className, ...placeholderProps }: PhotoProps) {
  const url = getPublicUrl(path);

  if (!url) {
    return (
      <PhotoPlaceholder aspect={aspect} rounded={rounded} className={className} {...placeholderProps} />
    );
  }

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      style={{ aspectRatio: aspect, borderRadius: rounded }}
    >
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.06]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
