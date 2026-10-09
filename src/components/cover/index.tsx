/* eslint-disable @next/next/no-img-element */
// Models
import type { CoverImage } from "@/core/models";

// A poster on AniList's dominant colour while it loads, stripes when there is none. Size and shape come from className.
export default function Cover({
  image,
  alt = "",
  isLarge = false,
  isDimmed = false,
  className = "",
}: {
  image: CoverImage | null;
  alt?: string;
  isLarge?: boolean;
  isDimmed?: boolean;
  className?: string;
}) {
  const src = (isLarge && image?.extraLarge) || image?.large || image?.extraLarge;

  return (
    <div className={`relative shrink-0 overflow-hidden ${src ? "" : "stripes"} ${className}`} style={{ backgroundColor: image?.color ?? undefined }}>
      {src && <img src={src} alt={alt} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${isDimmed ? "opacity-45" : ""}`} />}
    </div>
  );
}
