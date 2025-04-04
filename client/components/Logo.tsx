import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-bold">
        G
      </div>
      <span className="text-xl font-bold">GST360</span>
    </div>
  );
}
