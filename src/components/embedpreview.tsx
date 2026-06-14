interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface EmbedData {
  color?: string;
  author?: { name: string; iconUrl?: string };
  title?: string;
  url?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  fields?: EmbedField[];
  footer?: { text: string; iconUrl?: string };
  timestamp?: boolean;
}

interface EmbedPreviewProps {
  embed: EmbedData;
}

export function EmbedPreview({ embed }: EmbedPreviewProps) {
  const accentColor = embed.color || "#5865F2";

  return (
    <div className="rounded-md overflow-hidden max-w-xl" style={{ background: "hsl(220 9% 19%)" }}>
      <div className="flex" style={{ borderLeft: `4px solid ${accentColor}` }}>
        <div className="flex-1 p-3 pl-3 min-w-0">
          {/* Author */}
          {embed.author && (
            <div className="flex items-center gap-2 mb-2">
              {embed.author.iconUrl && (
                <img src={embed.author.iconUrl} className="w-5 h-5 rounded-full" alt="" />
              )}
              <span className="text-xs font-semibold text-foreground">{embed.author.name}</span>
            </div>
          )}

          {/* Title */}
          {embed.title && (
            <div className={`font-semibold text-sm mb-1 ${embed.url ? "text-discord-blurple hover:underline cursor-pointer" : "text-foreground"}`}>
              {embed.title}
            </div>
          )}

          {/* Description */}
          {embed.description && (
            <div className="text-xs text-foreground/80 whitespace-pre-wrap mb-2 leading-relaxed">
              {embed.description}
            </div>
          )}

          {/* Fields */}
          {embed.fields && embed.fields.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-2">
              {embed.fields.map((field, i) => (
                <div
                  key={i}
                  className={field.inline ? "" : "col-span-3"}
                >
                  <div className="text-xs font-semibold text-foreground mb-0.5">{field.name}</div>
                  <div className="text-xs text-foreground/75">{field.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Image */}
          {embed.image && (
            <img src={embed.image} className="rounded max-w-full mt-2" alt="" />
          )}

          {/* Footer */}
          {(embed.footer || embed.timestamp) && (
            <div className="flex items-center gap-2 mt-2">
              {embed.footer?.iconUrl && (
                <img src={embed.footer.iconUrl} className="w-4 h-4 rounded-full" alt="" />
              )}
              <span className="text-[10px] text-muted-foreground">
                {embed.footer?.text}
                {embed.footer?.text && embed.timestamp && " • "}
                {embed.timestamp && new Date().toLocaleDateString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                  hour: "2-digit", minute: "2-digit"
                })}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail */}
        {embed.thumbnail && (
          <div className="p-3 flex-shrink-0">
            <img src={embed.thumbnail} className="w-16 h-16 rounded object-cover" alt="" />
          </div>
        )}
      </div>
    </div>
  );
}
