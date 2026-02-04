import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui";
import type { Banner } from "@/lib/wordpress/banners";

export interface CategoryBannerGridProps {
  title?: string;
  banners: Banner[];
  columns?: 3 | 4 | 5 | 6;
  className?: string;
}

export default function CategoryBannerGrid({
  title = "Popular Categories",
  banners,
  columns = 5,
  className,
}: CategoryBannerGridProps) {
  if (banners.length === 0) {
    return null;
  }

  const gridCols = {
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  };

  return (
    <section className={cn("py-12 bg-gray-light", className)}>
      <div className="container mx-auto px-4">
        {title && (
          <div className="text-center mb-10">
            <SectionHeading centered>{title}</SectionHeading>
          </div>
        )}

        <div className={cn("grid gap-4 md:gap-6", gridCols[columns])}>
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link || "/shop"}
              className={cn(
                "group relative flex flex-col items-center",
                "p-4",
                "transition-all duration-200",
                "hover:shadow-lg"
              )}
            >
              <div className="relative w-[240px] h-[144px] mb-3">
                <Image
                  src={banner.imageUrl}
                  alt={banner.alt || banner.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                  sizes="240px"
                />
              </div>

              <h3 className="font-heading text-base uppercase text-center tracking-wide text-black group-hover:text-red-primary transition-colors">
                {banner.title}
              </h3>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
