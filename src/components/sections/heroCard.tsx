import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function Card({ title, description, icon: Icon }: CardProps) {
  return (
    <div className="border border-white/20 py-3 lg:py-8 2xl:py-10 pl-8 2xl:pl-10 pr-28 2xl:pr-56 rounded-xl bg-white/10 backdrop-blur-md">
      <div className="flex items-center gap-4 2xl:gap-5 justify-start">
        <div className="bg-[var(--accent)] p-3 2xl:p-4 rounded-lg text-[var(--primary)] flex items-center justify-center">
          <Icon size={24} className="2xl:w-7 2xl:h-7" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl 2xl:text-2xl font-semibold text-white whitespace-nowrap">
            {title}
          </h3>
          <p className="text-sm 2xl:text-base text-white/90 md:whitespace-nowrap">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
