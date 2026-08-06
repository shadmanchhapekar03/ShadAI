import { Bell, Check, ChevronDown, Menu, Moon, Sparkles, Sun } from "lucide-react";
import { Avatar } from "@/components/common/Avatar";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/store/useChatStore";

export const MODELS = [
  {
    id: "shadai-ultra",
    name: "ShadAI Ultra",
    hint: "Most capable",
    icon: "🚀",
  },
  { id: "shadai-pro", name: "ShadAI Pro", hint: "Balanced", icon: "⚡" },
  { id: "shadai-lite", name: "ShadAI Lite", hint: "Fast & cheap", icon: "🌱" },
];

export function TopNav() {
  const toggleSidebar = useChatStore((s) => s.toggleSidebar);
  const setMobileSidebarOpen = useChatStore((s) => s.setMobileSidebarOpen);
  const settings = useChatStore((s) => s.settings);
  const setModel = useChatStore((s) => s.setModel);
  const toggleTheme = useChatStore((s) => s.toggleTheme);
  const pushToast = useChatStore((s) => s.pushToast);

  const currentModel = MODELS.find((m) => m.id === settings.model) ?? MODELS[1];

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-background/70 px-3 backdrop-blur-xl sm:px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary lg:inline-flex"
        >
          <Menu className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">ShadAI</span>
          <Dropdown>
            <DropdownTrigger
              aria-label="Change model"
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="hidden sm:inline">{currentModel.name}</span>
              <span className="sm:hidden">Model</span>
              <ChevronDown className="h-3 w-3" />
            </DropdownTrigger>
            <DropdownContent align="start" className="w-60">
              <DropdownLabel>Choose a model</DropdownLabel>
              {MODELS.map((model) => (
                <DropdownItem
                  key={model.id}
                  onClick={() => {
                    setModel(model.id);
                    pushToast(`${model.name} selected`, "success");
                  }}
                >
                  <span className="text-base">{model.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{model.name}</span>
                    <span className="block text-[11px] text-text-muted">{model.hint}</span>
                  </span>
                  {settings.model === model.id && <Check className="h-4 w-4 text-accent" />}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={settings.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          onClick={toggleTheme}
          className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
        >
          {settings.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <Dropdown>
          <DropdownTrigger
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
          </DropdownTrigger>
          <DropdownContent align="end" className="w-72">
            <DropdownLabel>Notifications</DropdownLabel>
            <div className="flex items-start gap-3 px-3.5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Welcome to ShadAI</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  You can start a conversation right away, or browse suggested prompts below.
                </p>
              </div>
            </div>
          </DropdownContent>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger aria-label="Account menu" className="rounded-full">
            <Avatar size="sm" name="Shadman Chhapekar" />
          </DropdownTrigger>
          <DropdownContent align="end" className="w-60">
            <div className="px-3.5 py-3">
              <p className="text-sm font-medium text-text-primary">Shadman Chhapekar</p>
              <p className="text-xs text-text-muted">shadman@example.com</p>
            </div>
            <div className="my-1 h-px bg-white/10" />
            <DropdownItem icon={<Bell className="h-4 w-4" />} onClick={() => pushToast("No new notifications", "info")}>
              Notifications
            </DropdownItem>
            <DropdownItem icon={<Sun className="h-4 w-4" />} onClick={toggleTheme}>
              {settings.theme === "dark" ? "Light mode" : "Dark mode"}
            </DropdownItem>
            <DropdownItem
              icon={<Menu className="h-4 w-4" />}
              onClick={() => pushToast("Settings coming soon", "info")}
            >
              Settings
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </header>
  );
}
