import { useTodosStore } from "@/stores/use-todos-store";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Tab } from "@/stores/use-todos-store";

const FilterTabs = ({ counts }: { counts: Record<Tab, number> }) => {
  const tab = useTodosStore((s) => s.tab);
  const setTab = useTodosStore((s) => s.setTab);

  const filters: { value: Tab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "deleted", label: "Deleted" },
  ];

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
      <TabsList>
        {filters.map((filter) => (
          <TabsTrigger key={filter.value} value={filter.value}>
            {filter.label}
            <span className="text-muted-foreground ml-1.5 text-xs tabular-nums">{counts[filter.value]}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export { FilterTabs };
