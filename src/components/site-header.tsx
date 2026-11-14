import { PencilIcon } from "lucide-react";

export const SiteHeader = () => {
  return (
    <header className="flex justify-between items-center px-2 sm:px-4 bg-sidebar h-12">
      <div>
        <h2 className="text-xl font-medium tracking-wide flex items-center gap-4">
          <PencilIcon size={18} /> Tudus
        </h2>
      </div>
    </header>
  );
};
