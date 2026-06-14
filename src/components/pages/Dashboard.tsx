import { StatCard } from "../components/StatCard";
import {
  Server, Users, Zap, Clock, Ticket, Gift,
  Layers, Terminal, ShieldCheck, TrendingUp,
  Activity, MessageSquare, Hash
} from "lucide-react";

const recentActivity = [
  { type: "ticket", msg: "New ticket opened by @dragon_fire", time: "2m ago", color: "bg-discord-blurple" },
  { type: "giveaway", msg: "Giveaway ended in #giveaways — winner: @stellar_x", time: "12m ago", color: "bg-discord-warning" },
  { type: "mod", msg: "User @spammer123 was muted for 10 minutes", time: "23m ago", color: "bg-discord-danger" },
  { type: "welcome", msg: "@new_member joined the server", time: "31m ago", color: "bg-discord-success" },
  { type: "command", msg: "!ticket used by @help_me in #support", time: "45m ago", color: "bg-discord-fuchsia" },
  { type: "giveaway", msg: "Giveaway started: \"Discord Nitro\" — ends in 24h", time: "1h ago", color: "bg-discord-warning" },
];

const features = [
  { label: "Ticketing System", icon: Ticket, desc: "Private support channels with close/transcript", color: "text-discord-blurple", bg: "bg-discord-blurple/10" },
  { label: "Giveaways", icon: Gift, desc: "Reaction-based with auto winner picking", color: "text-discord-warning", bg: "bg-discord-warning/10" },
  { label: "Embed Builder", icon: Layers, desc: "Live preview Discord embed creator", color: "text-discord-fuchsia", bg: "bg-discord-fuchsia/10" },
  { label: "Moderation", icon: ShieldCheck, desc: "Ban, kick, mute, warn with mod-log", color: "text-discord-danger", bg: "bg-discord-danger/10" },
  { label: "Commands", icon: Terminal, desc: "24 commands across 6 categories", color: "text-discord-success", bg: "bg-discord-success/10" },
  { label: "Welcome System", icon: MessageSquare, desc: "Custom welcome & goodbye embeds", color: "text-discord-muted", bg: "bg-secondary" },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back — here's what's happening with your bot.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-discord-success/10 border border-discord-success/20 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-discord-success animate-pulse" />
          <span className="text-xs font-semibold text-discord-success">Bot Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Servers"
          value="12"
          subtitle="Connected guilds"
          icon={Server}
          variant="blurple"
          trend={{ value: "+2 this week", up: true }}
        />
        <StatCard
          title="Members Served"
          value="8,491"
          subtitle="Across all servers"
          icon={Users}
          variant="success"
          trend={{ value: "+134 today", up: true }}
        />
        <StatCard
          title="Commands Today"
          value="247"
          subtitle="All commands used"
          icon={Zap}
          variant="warning"
          trend={{ value: "+18% vs yesterday", up: true }}
        />
        <StatCard
          title="Uptime"
          value="99.9%"
          subtitle="Last 30 days"
          icon={Clock}
          variant="fuchsia"
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Tickets" value="7" subtitle="Awaiting response" icon={Ticket} variant="blurple" />
        <StatCard title="Active Giveaways" value="3" subtitle="Running now" icon={Gift} variant="warning" />
        <StatCard title="Messages Logged" value="1,204" subtitle="This week" icon={Hash} variant="success" />
        <StatCard title="Warnings Issued" value="14" subtitle="This month" icon={ShieldCheck} variant="danger" />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-discord-blurple" />
              <h2 className="font-semibold text-foreground text-sm">Recent Activity</h2>
            </div>
            <span className="text-xs text-muted-foreground">Live feed</span>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground/85 leading-relaxed">{item.msg}</p>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="rounded-xl bg-card border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-discord-blurple" />
            <h2 className="font-semibold text-foreground text-sm">Bot Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg ${f.bg} p-3 border border-border/50`}>
                <div className={`p-1.5 rounded-md bg-card flex-shrink-0`}>
                  <f.icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{f.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
