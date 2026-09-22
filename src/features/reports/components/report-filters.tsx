import { Button } from "@/components/ui/button";

type ReportFiltersProps = {
  startDate?: string;
  endDate?: string;
};

export function ReportFilters({
  startDate = "",
  endDate = "",
}: ReportFiltersProps) {
  return (
    <form className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-[1fr_1fr_auto]">
      <label className="space-y-2">
        <span className="text-sm font-medium">Início</span>
        <input
          type="date"
          name="startDate"
          defaultValue={startDate}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <label className="space-y-2">
        <span className="text-sm font-medium">Fim</span>
        <input
          type="date"
          name="endDate"
          defaultValue={endDate}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <div className="flex items-end">
        <Button type="submit" className="w-full">
          Filtrar
        </Button>
      </div>
    </form>
  );
}
