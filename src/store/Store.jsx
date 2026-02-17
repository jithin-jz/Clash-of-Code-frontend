import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Check,
  Sparkles,
  Type,
  Palette,
  Package,
  PartyPopper,
  Zap,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import useAuthStore from "../stores/useAuthStore";
import useStoreStore from "../stores/useStoreStore";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import StoreSkeleton from "./StoreSkeleton";

const CATEGORIES = [
  { id: "THEME", label: "Themes", icon: Palette },
  { id: "FONT", label: "Fonts", icon: Type },
  { id: "EFFECT", label: "Effects", icon: Sparkles },
  { id: "VICTORY", label: "Victory", icon: PartyPopper },
];

const Store = () => {
  const navigate = useNavigate();
  const { user, checkAuth, setUser } = useAuthStore();
  const {
    items,
    isLoading,
    isMutating,
    activeMutationItemId,
    error,
    fetchItems,
    purchaseItem,
    equipItem,
    unequipCategory,
  } = useStoreStore();
  const [activeCategory, setActiveCategory] = useState("THEME");

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleBuy = async (item) => {
    if (!user || user.profile.xp < item.cost) return;

    const result = await purchaseItem(item.id);
    if (result.success) {
      toast.success(result.data.message || "Purchase successful.");
      await checkAuth();
    } else {
      toast.error(result.error || "Purchase failed.");
    }
  };

  const handleEquip = async (item) => {
    const result = await equipItem(item.id);
    if (result.success) {
      const data = result.data || {};
      if (user?.profile) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            ...(data.active_theme ? { active_theme: data.active_theme } : {}),
            ...(data.active_font ? { active_font: data.active_font } : {}),
            ...(data.active_effect ? { active_effect: data.active_effect } : {}),
            ...(data.active_victory ? { active_victory: data.active_victory } : {}),
          },
        });
      }
      toast.success(result.data.message || "Equipped successfully.");
      await checkAuth();
    } else {
      toast.error(result.error || "Failed to equip.");
    }
  };

  const handleUnequip = async (item) => {
    const result = await unequipCategory(item.category);
    if (result.success) {
      if (user?.profile) {
        setUser({
          ...user,
          profile: {
            ...user.profile,
            ...(item.category === "THEME" ? { active_theme: "vs-dark" } : {}),
            ...(item.category === "FONT" ? { active_font: "Fira Code" } : {}),
            ...(item.category === "EFFECT" ? { active_effect: null } : {}),
            ...(item.category === "VICTORY" ? { active_victory: "default" } : {}),
          },
        });
      }
      toast.success(result.data.message || "Unequipped successfully.");
      await checkAuth();
    } else {
      toast.error(result.error || "Failed to unequip.");
    }
  };

  const isItemActive = (item) => {
    if (!user?.profile) return false;
    if (item.category === "THEME")
      return user.profile.active_theme === item.item_data?.theme_key;
    if (item.category === "FONT")
      return user.profile.active_font === item.item_data?.font_family;
    if (item.category === "EFFECT")
      return (
        user.profile.active_effect === item.item_data?.effect_key ||
        user.profile.active_effect === item.item_data?.effect_type
      );
    if (item.category === "VICTORY")
      return (
        user.profile.active_victory === item.item_data?.victory_key ||
        user.profile.active_victory === item.item_data?.animation_type
      );
    return false;
  };

  const renderIcon = (iconName) => {
    const Icon = LucideIcons[iconName] || LucideIcons.Package;
    return <Icon className="w-8 h-8" />;
  };

  const filteredItems = useMemo(
    () => items.filter((item) => item.category === activeCategory),
    [items, activeCategory],
  );

  return (
    <AnimatePresence mode="wait">
      {isLoading && items.length === 0 ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          <StoreSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative min-h-screen bg-[#0b1119] text-white overflow-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="absolute inset-0 pointer-events-none bg-[#0b1119]" />
          <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-[#101928] via-[#0d141f] to-[#0a0f17]" />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.35) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          <div className="absolute top-0 left-[8%] w-[24rem] h-[24rem] rounded-full bg-[#2563eb]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-8rem] right-[10%] w-[20rem] h-[20rem] rounded-full bg-[#0ea5e9]/10 blur-3xl pointer-events-none" />

          {/* Minimal Header */}
          <header className="sticky top-0 z-30 bg-[#0a1220]/85 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="h-16 flex items-center justify-between">
                {/* Left: Back + Title */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/")}
                    className="h-9 w-9 text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    <ArrowLeft size={18} />
                  </Button>
                  <h1 className="text-base font-semibold tracking-tight">
                    Store
                  </h1>
                </div>

                {/* Right: XP Balance - Clickable */}
                <button
                  onClick={() => navigate("/buy-xp")}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] rounded-lg border border-white/15 hover:bg-white/[0.12] transition-all cursor-pointer"
                >
                  <Zap size={14} className="text-[#ffa116]" />
                  <span className="text-sm font-medium text-white">
                    {user?.profile?.xp?.toLocaleString() || 0}
                  </span>
                  <span className="text-xs text-slate-400">XP</span>
                </button>
              </div>
            </div>
          </header>

          {/* Category Tabs */}
          <div className="sticky top-16 z-20 border-b border-white/10 bg-[#0a1220]/75 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2.5">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap border
                        ${
                          isActive
                            ? "bg-white/[0.14] text-white border-white/25"
                            : "text-slate-300 border-transparent hover:text-white hover:bg-white/10 hover:border-white/15"
                        }
                      `}
                    >
                      <Icon size={14} />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-10">
            {filteredItems.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Package size={32} className="opacity-30" />
                <p className="text-sm">No items in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => {
                    const isActive = isItemActive(item);
                    const canAfford = user?.profile?.xp >= item.cost;
                    const isOwned = item.is_owned;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card
                          className={`
                            rounded-2xl overflow-hidden bg-[#0f1b2e]/75 border-[#7ea3d9]/20 hover:border-[#7ea3d9]/40 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.22)] transition-all
                            ${isActive ? "ring-1 ring-[#7ea3d9]/40" : ""}
                          `}
                        >
                          {/* Icon/Preview - Reduced Height */}
                          <div className="h-32 flex items-center justify-center bg-[#0b1526]/80 border-b border-white/10 relative">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-slate-500">
                                {renderIcon(item.icon_name)}
                              </div>
                            )}

                            {/* Status Badges */}
                            <div className="absolute top-2 right-2 flex gap-1.5">
                              {isOwned && (
                                <Badge
                                  variant="secondary"
                                  className="bg-[#162338] text-slate-200 text-[10px] px-1.5 py-0.5"
                                >
                                  <Check size={10} className="mr-0.5" />
                                  {isActive ? "Active" : "Owned"}
                                </Badge>
                              )}
                            </div>

                            {/* Category Badge */}
                            <Badge
                              variant="outline"
                              className="absolute top-2 left-2 bg-black/40 border-white/20 text-slate-300 text-[10px] px-1.5 py-0.5"
                            >
                              {item.category}
                            </Badge>
                          </div>

                          {/* Content - Compact Padding */}
                          <CardHeader className="p-3 pb-1.5">
                            <CardTitle className="text-xs font-medium text-white truncate">
                              {item.name}
                            </CardTitle>
                            <CardDescription className="text-[10px] text-slate-400 line-clamp-2 min-h-[32px] leading-tight">
                              {item.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="p-2.5 pt-0">
                            {isOwned ? (
                              <Button
                                variant={isActive ? "outline" : "default"}
                                className={`
                                  w-full h-8 text-xs font-medium
                                  ${
                                    isActive
                                      ? "bg-transparent border-white/20 text-slate-300 hover:bg-white/10"
                                      : "bg-white text-black hover:bg-slate-200"
                                  }
                                `}
                                onClick={() =>
                                  isActive
                                    ? handleUnequip(item)
                                    : handleEquip(item)
                                }
                              >
                                {isActive ? "Unequip" : "Equip"}
                              </Button>
                            ) : (
                              <Button
                                className={`
                                  w-full h-8 text-xs font-medium
                                  ${
                                    canAfford
                                      ? "bg-white text-black hover:bg-slate-200"
                                      : "bg-[#1a2638] text-slate-500 cursor-not-allowed"
                                  }
                                `}
                                disabled={
                                  !canAfford ||
                                  (isMutating &&
                                    activeMutationItemId === item.id)
                                }
                                onClick={() => handleBuy(item)}
                              >
                                {isMutating &&
                                activeMutationItemId === item.id ? (
                                  <Loader2 className="animate-spin w-3 h-3" />
                                ) : (
                                  <span className="flex items-center gap-1">
                                    {canAfford ? (
                                      <Zap size={10} />
                                    ) : (
                                      <Lock size={10} />
                                    )}
                                    {item.cost} XP
                                  </span>
                                )}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Store;
