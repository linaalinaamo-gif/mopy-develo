import { useState } from "react";
import { Settings, Save, Hash, Shield, Bell, Palette, Bot, ToggleLeft, ToggleRight } from "lucide-react";

interface Config {
  prefix: string;
  logChannel: string;
  modRole: string;
  ticketCategory: string;
  welcomeChannel: string;
  welcomeEnabled: boolean;
  ticketsEnabled: boolean;
  giveawaysEnabled: boolean;
  moderationEnabled: boolean;
  automodEnabled: boolean;
  loggingEnabled: boolean;
  embedColor: string;
}

const defaultConfig: Config = {
  prefix: "!",
  logChannel: "#mod-log",
  modRole: "Staff",
  ticketCategory: "Tickets",
  welcomeChannel: "#welcome",
  welcomeEnabled: true,
  ticketsEnabled: true,
  giveawaysEnabled: true,
  moderationEnabled: true,
  automodEnabled: false,
  loggingEnabled: true,
  embedColor: "#5865F2",
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
        enabled
          ? "bg-discord-success/15 border-discord-success/25 text-discord-success"
          : "bg-muted border-border text-muted-foreground"
      }`}
    >
      {enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
}

function InputField({ label, value, onChange, placeholder, icon: Icon }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; icon?: React.ElementType;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />}
        <input
          className={`w-full ${Icon ? "pl-8" : "pl-3"} pr-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple`}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

const cogModules = [
  { key: "ticketsEnabled", label: "Tickets System", desc: "Private support ticket channels", icon: Hash },
  { key: "giveawaysEnabled", label: "Giveaways", desc: "Reaction-based giveaway system", icon: Shield },
  { key: "moderationEnabled", label: "Moderation", desc: "Ban, kick, mute, warn commands", icon: Shield },
  { key: "welcomeEnabled", label: "Welcome System", desc: "Welcome & goodbye embed messages", icon: Bell },
  { key: "loggingEnabled", label: "Mod Logging", desc: "Log moderation actions to a channel", icon: Hash },
  { key: "automodEnabled", label: "Auto-Moderation", desc: "Auto-delete spam and bad words", icon: Bot },
];

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<Config>) => {
    setConfig(c => ({ ...c, ...patch }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-3xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-muted-foreground" />
            Bot Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure your bot prefix, channels, roles, and feature toggles.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-semibold transition-all ${
            saved
              ? "bg-discord-success/20 text-discord-success border border-discord-success/30"
              : "bg-discord-blurple text-white hover:opacity-90"
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* General */}
      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-4 h-4 text-discord-blurple" />
          <h2 className="text-sm font-semibold text-foreground">General</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Command Prefix</label>
            <input
              className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple font-mono"
              value={config.prefix}
              onChange={e => update({ prefix: e.target.value })}
              maxLength={5}
              placeholder="!"
            />
            <p className="text-[11px] text-muted-foreground mt-1">Commands will use this prefix (e.g. {config.prefix}help)</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Embed Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.embedColor}
                onChange={e => update({ embedColor: e.target.value })}
                className="w-10 h-9 rounded-lg border border-border bg-transparent cursor-pointer"
              />
              <input
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-discord-blurple"
                value={config.embedColor}
                onChange={e => update({ embedColor: e.target.value })}
                placeholder="#5865F2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Channels & Roles */}
      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-4 h-4 text-discord-blurple" />
          <h2 className="text-sm font-semibold text-foreground">Channels & Roles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Mod Log Channel" value={config.logChannel} onChange={v => update({ logChannel: v })} placeholder="#mod-log" icon={Hash} />
          <InputField label="Welcome Channel" value={config.welcomeChannel} onChange={v => update({ welcomeChannel: v })} placeholder="#welcome" icon={Hash} />
          <InputField label="Staff/Mod Role" value={config.modRole} onChange={v => update({ modRole: v })} placeholder="Staff" icon={Shield} />
          <InputField label="Ticket Category" value={config.ticketCategory} onChange={v => update({ ticketCategory: v })} placeholder="Tickets" icon={Hash} />
        </div>
      </div>

      {/* Cog Modules */}
      <div className="rounded-xl bg-card border border-border p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4 text-discord-blurple" />
          <h2 className="text-sm font-semibold text-foreground">Feature Modules</h2>
        </div>
        <div className="space-y-3">
          {cogModules.map(({ key, label, desc, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-discord-elevated flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
              <Toggle
                enabled={config[key as keyof Config] as boolean}
                onChange={v => update({ [key]: v })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* .env preview */}
      <div className="rounded-xl bg-card border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">.env Preview</h2>
        </div>
        <div className="rounded-lg bg-[hsl(220_10%_10%)] p-3 font-mono text-xs text-foreground/80 space-y-1">
          <div><span className="text-discord-success">DISCORD_TOKEN</span>=<span className="text-discord-warning">your_bot_token_here</span></div>
          <div><span className="text-discord-success">PREFIX</span>=<span className="text-discord-warning">{config.prefix}</span></div>
          <div><span className="text-discord-success">OWNER_ID</span>=<span className="text-discord-warning">your_discord_id</span></div>
          <div><span className="text-discord-success">MOD_ROLE</span>=<span className="text-discord-warning">{config.modRole}</span></div>
          <div><span className="text-discord-success">LOG_CHANNEL</span>=<span className="text-discord-warning">{config.logChannel}</span></div>
          <div><span className="text-discord-success">WELCOME_CHANNEL</span>=<span className="text-discord-warning">{config.welcomeChannel}</span></div>
          <div><span className="text-discord-success">EMBED_COLOR</span>=<span className="text-discord-warning">{parseInt(config.embedColor.slice(1), 16)}</span></div>
        </div>
      </div>
    </div>
  );
}
