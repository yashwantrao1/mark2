
import Link from "next/link";

import { getWorkSlug, type ExploreWorkItem } from "@/lib/homeData";

type Props = {
  items: ExploreWorkItem[];
};

export default function ExploreMoreWork({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="mx-auto my-44 w-full">
      <Link href="/work" className="text-sm font-bold hover:underline w-fit">
        Explore More Work
      </Link>
      <div className="flex flex-col py-6 px-10">
        {items.map((item) => (
          <Link
            key={item.link}
            href={`/work/${getWorkSlug(item)}`}
            className="text-7xl font-light font-heading leading-tight hover:underline w-fit underline-offset-4 decoration-2"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
