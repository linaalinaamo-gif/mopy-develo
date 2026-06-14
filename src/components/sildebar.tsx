import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Gift,
  Layers,
  Terminal,
  Settings,
  ChevronRight,
  Bot,
  Cpu,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/tickets", label: "Tickets", icon: Ticket },
  { path: "/giveaways", label: "Giveaways", icon: Gift },
  { path: "/embeds", label: "Embed Builder", icon: Layers },
  { path: "/commands", label: "Commands", icon: Terminal },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const location = useLocation();

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${collapsed ? "w-16" : "w-56"}`}
      style={{ background: "hsl(var(--discord-sidebar))", borderRight: "1px solid hsl(var(--border))" }}
    >
      {/* Bot brand */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-blurple flex items-center justify-center flex-shrink-0 animate-pulse-glow">
          <Bot className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-foreground leading-none">MyBot</div>
            <div className="text-[10px] text-discord-success flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-discord-success inline-block" />
              Online
            </div>
          </div>
        )}
      </div>

      <div className="px-2 mb-3">
        <div className="h-px bg-border" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {!collapsed && (
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 py-1.5 mb-1">
            Navigation
          </div>
        )}
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
                ${active
                  ? "bg-discord-blurple/20 text-discord-blurple"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }
                ${collapsed ? "justify-center px-0" : ""}
              `}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-discord-blurple rounded-r-full" />
              )}
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? "text-discord-blurple" : "group-hover:text-foreground"}`} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={`px-4 py-4 border-t border-border ${collapsed ? "px-2" : ""}`}>
        <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-discord-elevated flex items-center justify-center flex-shrink-0">
            <Cpu className="w-4 h-4 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-xs font-medium text-foreground truncate">discord.py 2.3</div>
              <div className="text-[10px] text-muted-foreground">Python 3.11</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
