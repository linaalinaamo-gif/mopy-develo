import { useState } from "react";
import { Ticket, X, ChevronRight, Code2, Eye } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const tickets = [
  { id: 1, user: "dragon_fire", avatar: "DF", channel: "ticket-0042", category: "Support", status: "open", created: "2h ago", preview: "My rank is not showing up after I linked my account..." },
  { id: 2, user: "stellar_x", avatar: "SX", channel: "ticket-0041", category: "Report", status: "open", created: "5h ago", preview: "User @troll99 is spamming in #general and ignoring warnings" },
  { id: 3, user: "nova_ray", avatar: "NR", channel: "ticket-0040", category: "Appeal", status: "pending", created: "1d ago", preview: "I was banned by mistake, I did not break any rules..." },
  { id: 4, user: "void_punk", avatar: "VP", channel: "ticket-0039", category: "Support", status: "closed", created: "2d ago", preview: "Thanks for the help! Issue resolved." },
  { id: 5, user: "echo_light", avatar: "EL", channel: "ticket-0038", category: "Other", status: "closed", created: "3d ago", preview: "Partnership inquiry for our community server." },
];

const statusConfig = {
  open: { label: "Open", color: "bg-discord-success/15 text-discord-success border-discord-success/20" },
  pending: { label: "Pending", color: "bg-discord-warning/15 text-discord-warning border-discord-warning/20" },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground border-border" },
};

const categoryColors: Record<string, string> = {
  Support: "bg-discord-blurple/15 text-discord-blurple border-discord-blurple/20",
  Report: "bg-discord-danger/15 text-discord-danger border-discord-danger/20",
  Appeal: "bg-discord-warning/15 text-discord-warning border-discord-warning/20",
  Other: "bg-secondary text-muted-foreground border-border",
};

const ticketCogCode = [
  "import discord",
  "from discord.ext import commands",
  "import asyncio",
  "from datetime import datetime",
  "from config import COLORS",
  "",
  "",
  "class TicketView(discord.ui.View):",
  '    """Persistent view with Close Ticket button."""',
  "",
  "    def __init__(self):",
  "        super().__init__(timeout=None)",
  "",
  "    @discord.ui.button(",
  '        label="Close Ticket",',
  "        style=discord.ButtonStyle.danger,",
  '        custom_id="ticket:close"',
  "    )",
  "    async def close_ticket(",
  "        self, interaction: discord.Interaction, button: discord.ui.Button",
  "    ):",
  "        channel = interaction.channel",
  "        await interaction.response.defer()",
  "",
  "        embed = discord.Embed(",
  '            title="Ticket Closing",',
  '            description="This ticket will be archived in **5 seconds**.",',
  '            color=COLORS["warning"],',
  "            timestamp=datetime.utcnow(),",
  "        )",
  '        embed.set_footer(text=f"Closed by {interaction.user.display_name}")',
  "        await channel.send(embed=embed)",
  "        await asyncio.sleep(5)",
  "",
  "        try:",
  "            await channel.edit(",
  '                name=channel.name.replace("ticket-", "closed-"),',
  "                overwrites={",
  "                    interaction.guild.default_role: discord.PermissionOverwrite(",
  "                        read_messages=False",
  "                    )",
  "                },",
  "            )",
  "        except discord.Forbidden:",
  "            await channel.delete()",
  "",
  "",
  "class OpenTicketView(discord.ui.View):",
  '    """Panel view for users to open tickets."""',
  "",
  "    def __init__(self):",
  "        super().__init__(timeout=None)",
  "",
  "    @discord.ui.button(",
  '        label="Open a Ticket",',
  "        style=discord.ButtonStyle.primary,",
  '        custom_id="ticket:open"',
  "    )",
  "    async def open_ticket(",
  "        self, interaction: discord.Interaction, button: discord.ui.Button",
  "    ):",
  "        guild = interaction.guild",
  "        user = interaction.user",
  '        cog = interaction.client.cogs.get("Tickets")',
  "        category = cog.ticket_category(guild) if cog else None",
  "",
  "        existing = discord.utils.get(",
  "            guild.text_channels,",
  '            name=f"ticket-{user.name.lower().replace(chr(32), chr(45))}"',
  "        )",
  "        if existing:",
  "            await interaction.response.send_message(",
  '                f"You already have an open ticket: {existing.mention}",',
  "                ephemeral=True,",
  "            )",
  "            return",
  "",
  "        overwrites = {",
  "            guild.default_role: discord.PermissionOverwrite(read_messages=False),",
  "            user: discord.PermissionOverwrite(read_messages=True, send_messages=True),",
  "        }",
  '        staff_role = discord.utils.get(guild.roles, name="Staff")',
  "        if staff_role:",
  "            overwrites[staff_role] = discord.PermissionOverwrite(",
  "                read_messages=True, send_messages=True, manage_messages=True",
  "            )",
  "",
  "        channel = await guild.create_text_channel(",
  '            name=f"ticket-{user.name.lower().replace(chr(32), chr(45))}",',
  "            category=category,",
  "            overwrites=overwrites,",
  '            topic=f"Ticket for {user.display_name}",',
  "        )",
  "",
  "        embed = discord.Embed(",
  '            title="Support Ticket Opened",',
  '            description=f"Hello {user.mention}! Staff will be with you shortly.",',
  '            color=COLORS["primary"],',
  "            timestamp=datetime.utcnow(),",
  "        )",
  "        embed.set_thumbnail(url=user.display_avatar.url)",
  '        embed.set_footer(text=f"Ticket for {user.display_name}")',
  "        await channel.send(embed=embed, view=TicketView())",
  "        await interaction.response.send_message(",
  '            f"Ticket created: {channel.mention}", ephemeral=True',
  "        )",
  "",
  "",
  "class Tickets(commands.Cog):",
  '    """Ticketing system with button-based workflow."""',
  "",
  "    def __init__(self, bot: commands.Bot):",
  "        self.bot = bot",
  "        bot.add_view(TicketView())",
  "        bot.add_view(OpenTicketView())",
  "",
  "    def ticket_category(self, guild):",
  '        return discord.utils.get(guild.categories, name="Tickets")',
  "",
  '    @commands.command(name="ticket")',
  "    @commands.guild_only()",
  '    async def ticket(self, ctx, *, reason: str = "No reason provided"):',
  '        """Create a support ticket. Usage: !ticket [reason]"""',
  "        guild = ctx.guild",
  "        user = ctx.author",
  "        category = self.ticket_category(guild)",
  "        overwrites = {",
  "            guild.default_role: discord.PermissionOverwrite(read_messages=False),",
  "            user: discord.PermissionOverwrite(read_messages=True, send_messages=True),",
  "        }",
  '        staff_role = discord.utils.get(guild.roles, name="Staff")',
  "        if staff_role:",
  "            overwrites[staff_role] = discord.PermissionOverwrite(",
  "                read_messages=True, send_messages=True, manage_messages=True",
  "            )",
  "        channel = await guild.create_text_channel(",
  '            name=f"ticket-{user.name.lower().replace(chr(32), chr(45))}",',
  "            category=category,",
  "            overwrites=overwrites,",
  "        )",
  "        embed = discord.Embed(",
  '            title="Support Ticket",',
  '            description=f"**Reason:** {reason}",',
  '            color=COLORS["primary"],',
  "            timestamp=datetime.utcnow(),",
  "        )",
  "        embed.set_author(name=user.display_name, icon_url=user.display_avatar.url)",
  "        await channel.send(embed=embed, view=TicketView())",
  '        await ctx.send(f"Ticket created: {channel.mention}", delete_after=10)',
  "",
  '    @commands.command(name="ticketpanel")',
  "    @commands.has_permissions(manage_guild=True)",
  "    async def ticket_panel(self, ctx):",
  '        """Send the ticket panel. Usage: !ticketpanel"""',
  "        embed = discord.Embed(",
  '            title="Support Center",',
  '            description="Click below to open a private support ticket.",',
  '            color=COLORS["primary"],',
  "        )",
  '        embed.set_footer(text="Powered by MyBot Ticket System")',
  "        await ctx.send(embed=embed, view=OpenTicketView())",
  "        await ctx.message.delete()",
  "",
  "",
  "async def setup(bot: commands.Bot):",
  "    await bot.add_cog(Tickets(bot))",
].join("\n");

export default function Tickets() {
  const [activeTab, setActiveTab] = useState("active");
  const [viewCode, setViewCode] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = tickets.filter(t =>
    activeTab === "active" ? t.status !== "closed" : t.status === "closed"
  );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Ticket className="w-6 h-6 text-discord-blurple" />
            Ticketing System
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage support tickets with private channels and close transcripts.
          </p>
        </div>
        <button
          onClick={() => setViewCode(v => !v)}
          className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors
            ${viewCode
              ? "bg-discord-blurple/20 border-discord-blurple/30 text-discord-blurple"
              : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
        >
          {viewCode ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
          {viewCode ? "View Tickets" : "View Cog Code"}
        </button>
      </div>

      {viewCode ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-sm text-muted-foreground">
              Save this as{" "}
              <code className="text-discord-blurple bg-discord-blurple/10 px-1.5 py-0.5 rounded text-xs font-mono">
                cogs/tickets.py
              </code>{" "}
              in your bot folder, then it auto-loads on startup.
            </p>
          </div>
          <CodeBlock code={ticketCogCode} filename="cogs/tickets.py" language="python" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Open", value: tickets.filter(t => t.status === "open").length, color: "text-discord-success" },
              { label: "Pending", value: tickets.filter(t => t.status === "pending").length, color: "text-discord-warning" },
              { label: "Closed", value: tickets.filter(t => t.status === "closed").length, color: "text-muted-foreground" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-card border border-border p-4 text-center">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-discord-elevated border border-border">
              <TabsTrigger value="active" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">Active</TabsTrigger>
              <TabsTrigger value="closed" className="data-[state=active]:bg-discord-blurple data-[state=active]:text-white">Closed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="rounded-xl bg-card border border-border overflow-hidden shadow-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border" style={{ background: "hsl(var(--discord-elevated))" }}>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">User</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden sm:table-cell">Channel</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Category</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                      <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Created</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((ticket) => (
                      <tr
                        key={ticket.id}
                        className={`border-b border-border/50 last:border-0 hover:bg-accent/30 cursor-pointer transition-colors ${selected === ticket.id ? "bg-discord-blurple/5" : ""}`}
                        onClick={() => setSelected(selected === ticket.id ? null : ticket.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-discord-blurple/20 text-discord-blurple text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {ticket.avatar}
                            </div>
                            <span className="text-sm font-medium text-foreground">@{ticket.user}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-xs text-muted-foreground font-mono">#{ticket.channel}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColors[ticket.category]}`}>
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusConfig[ticket.status as keyof typeof statusConfig].color}`}>
                            {statusConfig[ticket.status as keyof typeof statusConfig].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">{ticket.created}</span>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selected === ticket.id ? "rotate-90" : ""}`} />
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No tickets here.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {selected !== null && (() => {
                const t = tickets.find(t => t.id === selected);
                if (!t) return null;
                return (
                  <div className="mt-3 rounded-xl bg-card border border-discord-blurple/20 p-4 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-foreground">#{t.channel}</span>
                      <button onClick={() => setSelected(null)}>
                        <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{t.preview}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-discord-blurple text-white font-medium hover:opacity-90 transition-opacity">
                        Jump to Channel
                      </button>
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-discord-danger/15 text-discord-danger border border-discord-danger/20 font-medium hover:bg-discord-danger/25 transition-colors">
                        Close Ticket
                      </button>
                    </div>
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
