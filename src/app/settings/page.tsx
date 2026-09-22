import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TimerSettingsForm } from "@/features/settings/components/timer-settings-form";
import { getTimerSettings } from "@/server/services/timer-settings-service";

export default async function SettingsPage() {
  const settings = await getTimerSettings();

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Configurações"
          description="Ajuste o ciclo de foco usado por novas sessões."
        />
        <TimerSettingsForm settings={settings} />
      </div>
    </ServerAppShell>
  );
}
