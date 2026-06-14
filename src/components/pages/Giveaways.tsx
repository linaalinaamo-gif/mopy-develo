import { useState } from "react";
import { Gift, Clock, Trophy, Code2, Eye, Plus, Users, Star } from "lucide-react";
import { CodeBlock } from "../components/CodeBlock";

const giveaways = [
  {
    id: 1, prize: "Discord Nitro (3 months)", host: "admin_zero", channel: "#giveaways",
    winners: 1, entries: 142, endsIn: "18h 32m", status: "active", color: "border-discord-warning/30"
  },
  {
    id: 2, prize: "Custom Bot Setup", host: "mod_sam", channel: "#events",
    winners: 1, entries: 89, endsIn: "2d 5h", status: "active", color: "border-discord-blurple/30"
  },
  {
    id: 3, prize: "Steam Gift Card ($25)", host: "admin_zero", channel: "#giveaways",
    winners: 3, entries: 201, endsIn: "4d 12h", status: "active", color: "border-discord-success/30"
  },
  {
    id: 4, prize: "Server Booster Role (1yr)", host: "mod_sam", channel: "#giveaways",
    winners: 2, entries: 334, endsIn: "Ended", status: "ended", winner: "@stellar_x, @nova_ray", color: "border-border"
  },
  {
    id: 5, prize: "VIP Server Role (Lifetime)", host: "admin_zero", channel: "#events",
    winners: 1, entries: 556, endsIn: "Ended", status: "ended", winner: "@dragon_fire", color: "border-border"
  },
];

const giveawayCogCode = [
  "import discord",
  "from discord.ext import commands",
  "import asyncio",
  "import random",
  "from datetime import datetime",
  "from config import COLORS",
  "",
  "",
  "def parse_duration(duration: str) -> int:",
  '    """Parse duration string like 1d2h30m into seconds."""',
  "    total = 0",
  "    units = {'d': 86400, 'h': 3600, 'm': 60, 's': 1}",
  "    current = ''",
  "    for char in duration:",
  "        if char.isdigit():",
  "            current += char",
  "        elif char in units and current:",
  "            total += int(current) * units[char]",
  "            current = ''",
  "    return total",
  "",
  "",
  "class Giveaway(commands.Cog):",
  '    """Full-featured giveaway system."""',
  "",
  "    def __init__(self, bot: commands.Bot):",
  "        self.bot = bot",
  "        self.active_giveaways: dict[int, dict] = {}",
  "",
  '    @commands.group(name="giveaway", aliases=["gw"])',
  "    @commands.guild_only()",
  "    @commands.has_permissions(manage_guild=True)",
  "    async def giveaway(self, ctx):",
  '        """Giveaway command group. Use !giveaway start/end/reroll."""',
  "        if ctx.invoked_subcommand is None:",
  "            await ctx.send_help(ctx.command)",
  "",
  '    @giveaway.command(name="start")',
  "    async def giveaway_start(",
  "        self,",
  "        ctx,",
  "        duration: str,",
  "        winners: int,",
  "        *,",
  "        prize: str",
  "    ):",
  '        """Start a giveaway. Usage: !giveaway start 1d 1 Discord Nitro"""',
  "        seconds = parse_duration(duration)",
  "        if seconds < 10:",
  '            return await ctx.send("Duration must be at least 10 seconds.")',
  "",
  "        embed = discord.Embed(",
  '            title=f"GIVEAWAY: {prize}",',
  '            description=(',
  '                f"React with to enter!",',
  '                f"Winners: **{winners}**",',
  '                f"Hosted by: {ctx.author.mention}",',
  '            ),',
  '            color=COLORS["warning"],',
  "            timestamp=datetime.utcnow(),",
  "        )",
  '        embed.set_footer(text=f"Ends in {duration} | {winners} winner(s)")',
  "        msg = await ctx.send(embed=embed)",
  '        await msg.add_reaction("🎉")',
  "        await ctx.message.delete()",
  "",
  "        self.active_giveaways[msg.id] = {",
  '            "prize": prize,',
  '            "winners": winners,',
  '            "channel": ctx.channel.id,',
  '            "message": msg.id,',
  '            "host": ctx.author.id,',
  "        }",
  "",
  "        await asyncio.sleep(seconds)",
  "        await self._end_giveaway(msg.id, ctx.channel, prize, winners, ctx.author)",
  "",
  "    async def _end_giveaway(",
  "        self, message_id: int, channel, prize: str, winners_count: int, host",
  "    ):",
  "        try:",
  "            msg = await channel.fetch_message(message_id)",
  "        except discord.NotFound:",
  "            return",
  "",
  '        reaction = discord.utils.get(msg.reactions, emoji="🎉")',
  "        if not reaction:",
  "            await channel.send('No valid entries. Giveaway cancelled.')",
  "            return",
  "",
  "        users = [u async for u in reaction.users() if not u.bot]",
  "        if not users:",
  "            await channel.send('No valid entries. Giveaway cancelled.')",
  "            return",
  "",
  "        chosen = random.sample(users, min(winners_count, len(users)))",
  "        mentions = ', '.join(w.mention for w in chosen)",
  "",
  "        embed = discord.Embed(",
  '            title=f"GIVEAWAY ENDED: {prize}",',
  '            description=f"Winner(s): {mentions}",',
  '            color=COLORS["success"],',
  "            timestamp=datetime.utcnow(),",
  "        )",
  '        embed.set_footer(text=f"Hosted by {host.display_name}")',
  "        await msg.edit(embed=embed)",
  '        await channel.send(f"Congratulations {mentions}! You won **{prize}**!")',
  "        self.active_giveaways.pop(message_id, None)",
  "",
  '    @giveaway.command(name="end")',
  "    async def giveaway_end(self, ctx, message_id: int):",
  '        """End a giveaway early. Usage: !giveaway end <message_id>"""',
  "        data = self.active_giveaways.get(message_id)",
  "        if not data:",
  '            return await ctx.send("No active giveaway with that ID.")',
  "        channel = self.bot.get_channel(data['channel'])",
  "        host = ctx.guild.get_member(data['host'])",
  "        await self._end_giveaway(",
  "            message_id, channel, data['prize'], data['winners'], host",
  "        )",
  "",
  '    @giveaway.command(name="reroll")',
  "    async def giveaway_reroll(self, ctx, message_id: int):",
  '        """Reroll a giveaway. Usage: !giveaway reroll <message_id>"""',
  "        try:",
  "            msg = await ctx.channel.fetch_message(message_id)",
  "        except discord.NotFound:",
  '            return await ctx.send("Message not found.")',
  "",
  '        reaction = discord.utils.get(msg.reactions, emoji="🎉")',
  "        users = [u async for u in reaction.users() if not u.bot]",
  "        if not users:",
  '            return await ctx.send("No valid entries to reroll.")',
  "        winner = random.choice(users)",
  '        await ctx.send(f"New winner: {winner.mention}! Congratulations!")',
  "",
  "",
  "async def setup(bot: commands.Bot):",
  "    await bot.add_cog(Giveaway(bot))",
].join("\n");

interface CreateForm {
  prize: string;
  duration: string;
  winners: string;
  channel: string;
}

export default function Giveaways() {
  const [viewCode, setViewCode] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateForm>({ prize: "", duration: "1d", winners: "1", channel: "#giveaways" });

  const active = giveaways.filter(g => g.status === "active");
  const ended = giveaways.filter(g => g.status === "ended");

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Gift className="w-6 h-6 text-discord-warning" />
            Giveaways
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Reaction-based giveaways with auto winner picking and reroll support.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewCode(v => !v)}
            className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors
              ${viewCode ? "bg-discord-blurple/20 border-discord-blurple/30 text-discord-blurple" : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
          >
            {viewCode ? <Eye className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
            {viewCode ? "View Giveaways" : "View Cog Code"}
          </button>
          {!viewCode && (
            <button
              onClick={() => setShowCreate(v => !v)}
              className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-discord-warning text-black font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Giveaway
            </button>
          )}
        </div>
      </div>

      {viewCode ? (
        <div className="space-y-3">
          <div className="rounded-xl bg-card border border-border p-4">
            <p className="text-sm text-muted-foreground">
              Save as{" "}
              <code className="text-discord-blurple bg-discord-blurple/10 px-1.5 py-0.5 rounded text-xs font-mono">cogs/giveaway.py</code>.
              Commands: <code className="text-discord-warning text-xs">!giveaway start 1d 1 Prize</code>,{" "}
              <code className="text-discord-warning text-xs">!giveaway end</code>,{" "}
              <code className="text-discord-warning text-xs">!giveaway reroll</code>
            </p>
          </div>
          <CodeBlock code={giveawayCogCode} filename="cogs/giveaway.py" language="python" />
        </div>
      ) : (
        <>
          {/* Create giveaway form */}
          {showCreate && (
            <div className="rounded-xl bg-card border border-discord-warning/25 p-5 animate-fade-in space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Create Giveaway</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Prize</label>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-warning"
                    placeholder="e.g. Discord Nitro"
                    value={form.prize}
                    onChange={e => setForm(f => ({ ...f, prize: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Duration</label>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-warning"
                    placeholder="e.g. 1d, 12h, 30m"
                    value={form.duration}
                    onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Number of Winners</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-discord-warning"
                    value={form.winners}
                    onChange={e => setForm(f => ({ ...f, winners: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Channel</label>
                  <input
                    className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-warning"
                    placeholder="#giveaways"
                    value={form.channel}
                    onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
                  />
                </div>
              </div>
              <div className="pt-1 border-t border-border flex items-center gap-3">
                <div className="flex-1 text-xs text-muted-foreground font-mono">
                  !giveaway start {form.duration} {form.winners} {form.prize || "Prize Name"}
                </div>
                <button className="text-sm px-4 py-1.5 rounded-lg bg-discord-warning text-black font-semibold hover:opacity-90 transition-opacity">
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-card border border-border p-4 text-center">
              <div className="text-2xl font-bold text-discord-warning">{active.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Active</div>
            </div>
            <div className="rounded-xl bg-card border border-border p-4 text-center">
              <div className="text-2xl font-bold text-muted-foreground">{ended.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Ended</div>
            </div>
            <div className="rounded-xl bg-card border border-border p-4 text-center">
              <div className="text-2xl font-bold text-discord-blurple">{giveaways.reduce((a, g) => a + g.entries, 0).toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">Total Entries</div>
            </div>
          </div>

          {/* Active giveaways */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-discord-warning" />
              Active Giveaways
            </h2>
            <div className="grid gap-3">
              {active.map(g => (
                <div key={g.id} className={`rounded-xl bg-card border ${g.color} p-4 flex flex-col sm:flex-row sm:items-center gap-3`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-foreground">{g.prize}</span>
                      <span className="text-xs text-muted-foreground font-mono">{g.channel}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {g.entries} entries
                      </span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Trophy className="w-3 h-3" /> {g.winners} winner{g.winners > 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-muted-foreground">Hosted by @{g.host}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-discord-warning">{g.endsIn}</div>
                      <div className="text-[10px] text-muted-foreground">remaining</div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-discord-warning animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ended giveaways */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Ended Giveaways
            </h2>
            <div className="grid gap-3">
              {ended.map(g => (
                <div key={g.id} className="rounded-xl bg-card border border-border p-4 opacity-70 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground/70">{g.prize}</div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">{g.entries} entries</span>
                      <span className="text-[11px] text-discord-success flex items-center gap-1">
                        <Star className="w-3 h-3" /> {g.winner}
                      </span>
                    </div>
                  </div>
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-discord-elevated text-muted-foreground hover:text-foreground border border-border transition-colors flex-shrink-0">
                    Reroll
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
