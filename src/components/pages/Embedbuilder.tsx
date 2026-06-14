import { useState } from "react";
import { Layers, Plus, Trash2, RefreshCw } from "lucide-react";
import { EmbedPreview } from "../components/EmbedPreview";

interface EmbedField {
  name: string;
  value: string;
  inline: boolean;
}

interface EmbedData {
  color: string;
  author: { name: string; iconUrl: string };
  title: string;
  url: string;
  description: string;
  thumbnail: string;
  image: string;
  fields: EmbedField[];
  footer: { text: string; iconUrl: string };
  timestamp: boolean;
}

const defaultEmbed: EmbedData = {
  color: "#5865F2",
  author: { name: "", iconUrl: "" },
  title: "My Awesome Embed",
  url: "",
  description: "This is a **beautiful** Discord embed built with MyBot.\n\nUse the form on the left to customize every field.",
  thumbnail: "",
  image: "",
  fields: [
    { name: "Field One", value: "This is an inline field", inline: true },
    { name: "Field Two", value: "Also inline!", inline: true },
    { name: "Wide Field", value: "This field spans the full width of the embed.", inline: false },
  ],
  footer: { text: "MyBot Embed Builder", iconUrl: "" },
  timestamp: true,
};

const PRESET_COLORS = [
  { label: "Blurple", value: "#5865F2" },
  { label: "Green", value: "#57F287" },
  { label: "Yellow", value: "#FEE75C" },
  { label: "Red", value: "#ED4245" },
  { label: "Fuchsia", value: "#EB459E" },
  { label: "White", value: "#FFFFFF" },
  { label: "Black", value: "#23272A" },
  { label: "Teal", value: "#1ABC9C" },
];

const PRESETS = [
  {
    label: "Welcome",
    data: {
      color: "#57F287",
      title: "Welcome to the Server!",
      description: "We are glad to have you here. Please read the rules and enjoy your stay!",
      author: { name: "", iconUrl: "" },
      footer: { text: "Member joined", iconUrl: "" },
      fields: [{ name: "Rules", value: "#rules", inline: true }, { name: "Roles", value: "#roles", inline: true }],
      timestamp: true,
      url: "", thumbnail: "", image: "",
    },
  },
  {
    label: "Giveaway",
    data: {
      color: "#FEE75C",
      title: "GIVEAWAY: Discord Nitro",
      description: "React with to enter!\n\n**Winners:** 1\n**Ends:** In 24 hours",
      author: { name: "Giveaways", iconUrl: "" },
      footer: { text: "Ends in 24h | 1 winner", iconUrl: "" },
      fields: [{ name: "Hosted by", value: "@admin", inline: true }, { name: "Entries", value: "142", inline: true }],
      timestamp: false,
      url: "", thumbnail: "", image: "",
    },
  },
  {
    label: "Announcement",
    data: {
      color: "#5865F2",
      title: "Important Announcement",
      description: "We have some exciting news to share with the community. Stay tuned for more updates!",
      author: { name: "Server Staff", iconUrl: "" },
      footer: { text: "MyBot Announcements", iconUrl: "" },
      fields: [],
      timestamp: true,
      url: "", thumbnail: "", image: "",
    },
  },
  {
    label: "Modlog",
    data: {
      color: "#ED4245",
      title: "Member Muted",
      description: "A moderation action has been taken.",
      author: { name: "Moderation Log", iconUrl: "" },
      footer: { text: "Case #42", iconUrl: "" },
      fields: [
        { name: "User", value: "@offender", inline: true },
        { name: "Moderator", value: "@mod_sam", inline: true },
        { name: "Duration", value: "10 minutes", inline: true },
        { name: "Reason", value: "Spam in #general", inline: false },
      ],
      timestamp: true,
      url: "", thumbnail: "", image: "",
    },
  },
];

function InputField({ label, value, onChange, placeholder = "", type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{label}</label>
      <input
        type={type}
        className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function EmbedBuilder() {
  const [embed, setEmbed] = useState<EmbedData>(defaultEmbed);

  const update = (patch: Partial<EmbedData>) => setEmbed(e => ({ ...e, ...patch }));

  const addField = () =>
    update({ fields: [...embed.fields, { name: "New Field", value: "Value", inline: false }] });

  const updateField = (i: number, patch: Partial<EmbedField>) =>
    update({ fields: embed.fields.map((f, idx) => idx === i ? { ...f, ...patch } : f) });

  const removeField = (i: number) =>
    update({ fields: embed.fields.filter((_, idx) => idx !== i) });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-discord-fuchsia" />
            Embed Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Design Discord embeds visually with a live preview.
          </p>
        </div>
        <button
          onClick={() => setEmbed(defaultEmbed)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => setEmbed({ ...embed, ...p.data })}
            className="text-xs px-3 py-1.5 rounded-lg bg-discord-elevated border border-border text-muted-foreground hover:text-foreground hover:border-discord-blurple/40 transition-colors font-medium"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form panel */}
        <div className="space-y-5 overflow-y-auto">
          {/* Color */}
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Accent Color</h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c.value}
                  title={c.label}
                  onClick={() => update({ color: c.value })}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${embed.color === c.value ? "border-foreground scale-110" : "border-border"}`}
                  style={{ background: c.value }}
                />
              ))}
              <input
                type="color"
                value={embed.color}
                onChange={e => update({ color: e.target.value })}
                className="w-7 h-7 rounded-full cursor-pointer border-2 border-border bg-transparent"
                title="Custom color"
              />
            </div>
          </div>

          {/* Author */}
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Author</h3>
            <InputField label="Author Name" value={embed.author.name} onChange={v => update({ author: { ...embed.author, name: v } })} placeholder="Author name..." />
            <InputField label="Author Icon URL" value={embed.author.iconUrl} onChange={v => update({ author: { ...embed.author, iconUrl: v } })} placeholder="https://..." />
          </div>

          {/* Body */}
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Body</h3>
            <InputField label="Title" value={embed.title} onChange={v => update({ title: v })} placeholder="Embed title..." />
            <InputField label="URL (makes title a link)" value={embed.url} onChange={v => update({ url: v })} placeholder="https://..." />
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 text-sm rounded-lg bg-discord-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple resize-none"
                value={embed.description}
                onChange={e => update({ description: e.target.value })}
                placeholder="Supports **markdown** and _formatting_..."
              />
            </div>
          </div>

          {/* Images */}
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Images</h3>
            <InputField label="Thumbnail URL (small, top-right)" value={embed.thumbnail} onChange={v => update({ thumbnail: v })} placeholder="https://..." />
            <InputField label="Image URL (large, below body)" value={embed.image} onChange={v => update({ image: v })} placeholder="https://..." />
          </div>

          {/* Fields */}
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fields ({embed.fields.length}/25)</h3>
              <button onClick={addField} className="flex items-center gap-1 text-xs text-discord-blurple hover:text-discord-blurple/80 font-medium">
                <Plus className="w-3.5 h-3.5" />
                Add Field
              </button>
            </div>
            {embed.fields.map((field, i) => (
              <div key={i} className="rounded-lg bg-discord-elevated p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Field {i + 1}</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.inline}
                        onChange={e => updateField(i, { inline: e.target.checked })}
                        className="rounded accent-discord-blurple"
                      />
                      Inline
                    </label>
                    <button onClick={() => removeField(i)} className="text-discord-danger/70 hover:text-discord-danger transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple"
                  value={field.name}
                  onChange={e => updateField(i, { name: e.target.value })}
                  placeholder="Field name..."
                />
                <input
                  className="w-full px-2.5 py-1.5 text-xs rounded-md bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-discord-blurple"
                  value={field.value}
                  onChange={e => updateField(i, { value: e.target.value })}
                  placeholder="Field value..."
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="rounded-xl bg-card border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Footer</h3>
              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={embed.timestamp}
                  onChange={e => update({ timestamp: e.target.checked })}
                  className="rounded accent-discord-blurple"
                />
                Show Timestamp
              </label>
            </div>
            <InputField label="Footer Text" value={embed.footer.text} onChange={v => update({ footer: { ...embed.footer, text: v } })} placeholder="Footer text..." />
            <InputField label="Footer Icon URL" value={embed.footer.iconUrl} onChange={v => update({ footer: { ...embed.footer, iconUrl: v } })} placeholder="https://..." />
          </div>
        </div>

        {/* Preview panel */}
        <div className="space-y-4">
          <div className="rounded-xl bg-card border border-border p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Live Preview</h3>

            {/* Discord-style chat mock */}
            <div className="rounded-lg p-3" style={{ background: "hsl(220 9% 16%)" }}>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-discord-blurple flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  B
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-semibold text-discord-blurple">MyBot</span>
                    <span className="text-[10px] text-muted-foreground">Today at {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <EmbedPreview embed={{
                    color: embed.color,
                    author: embed.author.name ? embed.author : undefined,
                    title: embed.title || undefined,
                    url: embed.url || undefined,
                    description: embed.description || undefined,
                    thumbnail: embed.thumbnail || undefined,
                    image: embed.image || undefined,
                    fields: embed.fields.length > 0 ? embed.fields : undefined,
                    footer: embed.footer.text ? embed.footer : undefined,
                    timestamp: embed.timestamp,
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* JSON output */}
          <div className="rounded-xl bg-card border border-border p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Python Code</h3>
            <div className="rounded-lg bg-[hsl(220_10%_10%)] p-3 overflow-x-auto">
              <pre className="code-block text-xs text-foreground/80">{`embed = discord.Embed(
    title="${embed.title}",
    description="${embed.description.slice(0, 50)}...",
    color=${parseInt(embed.color.slice(1), 16)},
    timestamp=datetime.utcnow(),
)${embed.author.name ? `
embed.set_author(name="${embed.author.name}")` : ""}${embed.thumbnail ? `
embed.set_thumbnail(url="${embed.thumbnail}")` : ""}${embed.footer.text ? `
embed.set_footer(text="${embed.footer.text}")` : ""}${embed.fields.map(f => `
embed.add_field(name="${f.name}", value="${f.value}", inline=${f.inline ? "True" : "False"})`).join("")}
await ctx.send(embed=embed)`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
