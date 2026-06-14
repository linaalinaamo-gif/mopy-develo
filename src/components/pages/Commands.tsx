import { useState } from "react";
import { Terminal, Search, ChevronDown, ShieldCheck, Gift, Ticket, Layers, Zap, Star } from "lucide-react";

interface Command {
  name: string;
  description: string;
  usage: string;
  cooldown: string;
  perms: string;
  category: string;
}

const commands: Command[] = [
  // Moderation
  { name: "ban", description: "Ban a member from the server", usage: "!ban @user [reason]", cooldown: "5s", perms: "Ban Members", category: "Moderation" },
  { name: "kick", description: "Kick a member from the server", usage: "!kick @user [reason]", cooldown: "5s", perms: "Kick Members", category: "Moderation" },
  { name: "mute", description: "Mute a member for a duration", usage: "!mute @user 10m [reason]", cooldown: "5s", perms: "Manage Roles", category: "Moderation" },
  { name: "unmute", description: "Remove mute from a member", usage: "!unmute @user", cooldown: "5s", perms: "Manage Roles", category: "Moderation" },
  { name: "warn", description: "Issue a warning to a member", usage: "!warn @user [reason]", cooldown: "3s", perms: "Manage Messages", category: "Moderation" },
  { name: "warnings", description: "View all warnings for a member", usage: "!warnings @user", cooldown: "3s", perms: "Manage Messages", category: "Moderation" },
  { name: "purge", description: "Delete a number of messages", usage: "!purge [1-100]", cooldown: "10s", perms: "Manage Messages", category: "Moderation" },
  // Tickets
  { name: "ticket", description: "Open a support ticket manually", usage: "!ticket [reason]", cooldown: "30s", perms: "None", category: "Tickets" },
  { name: "ticketpanel", description: "Send ticket panel to channel", usage: "!ticketpanel", cooldown: "None", perms: "Manage Guild", category: "Tickets" },
  // Giveaways
  { name: "giveaway start", description: "Start a giveaway", usage: "!giveaway start 1d 1 Prize", cooldown: "10s", perms: "Manage Guild", category: "Giveaways" },
  { name: "giveaway end", description: "End a giveaway early", usage: "!giveaway end <msg_id>", cooldown: "5s", perms: "Manage Guild", category: "Giveaways" },
  { name: "giveaway reroll", description: "Reroll giveaway winner", usage: "!giveaway reroll <msg_id>", cooldown: "5s", perms: "Manage Guild", category: "Giveaways" },
  // Utility
  { name: "help", description: "Show all available commands", usage: "!help [command]", cooldown: "3s", perms: "None", category: "Utility" },
  { name: "ping", description: "Show bot latency", usage: "!ping", cooldown: "5s", perms: "None", category: "Utility" },
  { name: "serverinfo", description: "Display server information", usage: "!serverinfo", cooldown: "5s", perms: "None", category: "Utility" },
  { name: "userinfo", description: "Display user information", usage: "!userinfo [@user]", cooldown: "5s", perms: "None", category: "Utility" },
  { name: "avatar", description: "Show a user's avatar", usage: "!avatar [@user]", cooldown: "5s", perms: "None", category: "Utility" },
  // Fun
  { name: "8ball", description: "Ask the magic 8-ball", usage: "!8ball <question>", cooldown: "3s", perms: "None", category: "Fun" },
  { name: "coinflip", description: "Flip a coin", usage: "!coinflip", cooldown: "3s", perms: "None", category: "Fun" },
  { name: "poll", description: "Create a yes/no poll", usage: "!poll <question>", cooldown: "10s", perms: "None", category: "Fun" },
  { name: "dice", description: "Roll a dice (default d6)", usage: "!dice [sides]", cooldown: "3s", perms: "None", category: "Fun" },
  // Embeds
  { name: "embed", description: "Send a custom embed via JSON", usage: "!embed <json>", cooldown: "10s", perms: "Manage Messages", category: "Embeds" },
  { name: "announce", description: "Send an announcement embed", usage: "!announce #channel <msg>", cooldown: "30s", perms: "Manage Guild", category: "Embeds" },
  { name: "say", description: "Make the bot send a message", usage: "!say [#channel] <msg>", cooldown: "5s", perms: "Manage Messages", category: "Embeds" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Moderation: <ShieldCheck className="w-3.5 h-3.5" />,
  Tickets: <Ticket className="w-3.5 h-3.5" />,
  Giveaways: <Gift className="w-3.5 h-3.5" />,
  Utility: <Zap className="w-3.5 h-3.5" />,
  Fun: <Star className="w-3.5 h-3.5" />,
  Embeds: <Layers className="w-3.5 h-3.5" />,
};

const categoryColors: Record<string, string> = {
  Moderation: "text-discord-danger bg-discord-danger/10 border-discord-danger/20",
  Tickets: "text-discord-blurple bg-discord-blurple/10 border-discord-blurple/20",
  Giveaways: "text-discord-warning bg-discord-warning/10 border-discord-warning/20",
  Utility: "text-discord-success bg-discord-success/10 border-discord-success/20",
  Fun: "text-discord-fuchsia bg-discord-fuchsia/10 border-discord-fuchsia/20",
  Embeds: "text-muted-foreground bg-secondary border-border",
};

const categories = ["All", ...Object.keys(categoryIcons)];

export default function Commands() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = commands.filter(c => {
    const matchCategory = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = !search || c.name.includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Terminal className="w-6 h-6 text-discord-success" />
          Commands
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {commands.length} commands across {Object.keys(categoryIcons).length} categories.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple"
            placeholder="Search commands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors
                ${activeCategory === cat
                  ? "bg-discord-blurple/20 border-discord-blurple/30 text-discord-blurple"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
            >
              {cat !== "All" && categoryIcons[cat]}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden shadow-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border" style={{ background: "hsl(var(--discord-elevated))" }}>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Command</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Description</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Usage</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Cooldown</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden xl:table-cell">Permissions</th>
              <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Category</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cmd, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                <td className="px-4 py-3">
                  <code className="text-sm font-mono font-semibold text-discord-blurple">!{cmd.name}</code>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-foreground/80">{cmd.description}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <code className="text-xs font-mono text-muted-foreground bg-discord-elevated px-1.5 py-0.5 rounded">{cmd.usage}</code>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs text-muted-foreground">{cmd.cooldown}</span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-xs text-muted-foreground">{cmd.perms}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium w-fit ${categoryColors[cmd.category]}`}>
                    {categoryIcons[cmd.category]}
                    <span className="hidden sm:inline">{cmd.category}</span>
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No commands match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Showing {filtered.length} of {commands.length} commands
      </div>
    </div>
  );
}
