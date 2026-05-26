import { useEffect, useState } from "react";
import { ChevronDown, User as UserIcon, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({ compact = false }: { compact?: boolean }) {
  const { user, isAdmin, signOut } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setDisplayName(null);
      return;
    }
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => setDisplayName(data?.display_name ?? null));
  }, [user]);

  if (!user) return null;

  const name = displayName || user.email?.split("@")[0] || "Usuário";
  const role = isAdmin ? "Admin" : "Aluno";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border hover:bg-muted/60 transition-colors"
        aria-label="Menu do usuário"
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gradient-cta text-accent-foreground text-xs font-bold">
            {initials(name) || <UserIcon size={14} />}
          </AvatarFallback>
        </Avatar>
        {!compact && (
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">{name}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{role}</span>
          </div>
        )}
        <ChevronDown size={14} className="text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-semibold">{name}</span>
          <span className="text-xs font-normal text-muted-foreground truncate">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/minha-area" className="flex items-center gap-2 cursor-pointer">
            <UserIcon size={16} /> Minha área
          </a>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <a href="/admin" className="flex items-center gap-2 cursor-pointer text-primary">
              <LayoutDashboard size={16} /> Painel Admin
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
          <LogOut size={16} /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
