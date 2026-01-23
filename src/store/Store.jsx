import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, Lock, Check, Sparkles, Type, Palette, Package, PartyPopper } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { storeAPI } from '../services/api';
import useAuthStore from '../stores/useAuthStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
    { id: 'ALL', label: 'All Items', icon: ShoppingBag },
    { id: 'THEME', label: 'Themes', icon: Palette },
    { id: 'FONT', label: 'Fonts', icon: Type },
    { id: 'EFFECT', label: 'Effects', icon: Sparkles },
    { id: 'VICTORY', label: 'Victory', icon: PartyPopper },
];

const Store = () => {
    const navigate = useNavigate();
    const { user, checkAuth } = useAuthStore();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const [activeCategory, setActiveCategory] = useState('ALL');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await storeAPI.getItems();
                setItems(response.data);
            } catch (error) {
                console.error("Failed to fetch store items", error);
                toast.error("Failed to load store items.");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleBuy = async (item) => {
        if (!user || user.profile.xp < item.cost) return;

        setPurchasing(item.id);
        try {
            const response = await storeAPI.buyItem(item.id);
            toast.success(response.data.message);
            await checkAuth();
            setItems(prev => prev.map(i => 
                i.id === item.id ? { ...i, is_owned: true } : i
            ));
        } catch (error) {
            toast.error(error.response?.data?.error || "Purchase failed.");
        } finally {
            setPurchasing(null);
        }
    };

    const renderIcon = (iconName, category) => {
        const Icon = LucideIcons[iconName] || LucideIcons.Package;
        return <Icon className="w-10 h-10 text-gray-200 transition-transform group-hover:scale-105 duration-300" />;
    };

    const filteredItems = activeCategory === 'ALL' 
        ? items 
        : items.filter(item => item.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#09090b] text-gray-100 font-sans">
            {/* Header Area */}
            <div className="border-b border-border bg-[#09090b]/95 backdrop-blur supports-[backdrop-filter]:bg-[#09090b]/60 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => navigate('/')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={18} />
                        </Button>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold tracking-tight text-foreground">
                                Store
                            </h1>
                            <div className="h-4 w-px bg-border" />
                            <p className="text-sm text-muted-foreground">Premium Items</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm font-medium text-foreground">
                                {user?.profile?.xp?.toLocaleString() || 0} XP
                            </span>
                        </div>
                    </div>
                </div>

                {/* Categories Tab */}
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 overflow-x-auto pb-0 -mb-px no-scrollbar border-t border-border/50">
                    {CATEGORIES.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                    relative py-3 text-sm font-medium transition-colors whitespace-nowrap
                                    ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}
                                `}
                            >
                                {cat.label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Grid */}
            <div className="max-w-7xl mx-auto p-6">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                         {[...Array(8)].map((_, i) => (
                             <Card key={i} className="bg-card border-border h-full overflow-hidden">
                                 <div className="h-40 bg-muted/30 animate-pulse border-b border-border" />
                                 <CardHeader className="p-4 space-y-2">
                                     <div className="h-5 w-3/4 bg-muted/50 rounded animate-pulse" />
                                     <div className="h-3 w-1/2 bg-muted/50 rounded animate-pulse" />
                                 </CardHeader>
                                 <CardFooter className="mt-auto p-4 pt-0">
                                     <div className="h-9 w-full bg-muted/50 rounded animate-pulse" />
                                 </CardFooter>
                             </Card>
                         ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-4 border border-dashed border-border rounded-lg bg-card/50">
                        <Package size={32} className="opacity-50" />
                        <p className="text-sm">No items found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="bg-card border-border hover:border-primary/50 transition-colors flex flex-col h-full overflow-hidden group">
                                        {/* Image / Preview Area */}
                                        <div className="h-40 relative bg-muted/30 flex items-center justify-center border-b border-border">
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover transition-opacity hover:opacity-90" 
                                                />
                                            ) : (
                                                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                                                    {renderIcon(item.icon_name, item.category)}
                                                </div>
                                            )}
                                            
                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <Badge variant="secondary" className="text-[10px] font-medium bg-background/80 backdrop-blur border-border text-foreground">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            
                                            {/* Owned Status */}
                                            {item.is_owned && (
                                                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur text-foreground text-[10px] px-2 py-0.5 rounded-full font-medium border border-border flex items-center gap-1">
                                                    <Check size={10} /> Owned
                                                </div>
                                            )}
                                        </div>

                                        <CardHeader className="p-4">
                                            <CardTitle className="text-base font-semibold text-card-foreground">
                                                {item.name}
                                            </CardTitle>
                                            <CardDescription className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardFooter className="mt-auto p-4 pt-0">
                                            {(['THEME', 'FONT', 'EFFECT', 'VICTORY'].includes(item.category)) && item.is_owned ? (
                                                (() => {
                                                    let isActive = false;
                                                    if (item.category === 'THEME') isActive = user?.profile?.active_theme === item.item_data?.theme_key;
                                                    if (item.category === 'FONT') isActive = user?.profile?.active_font === item.item_data?.font_family;
                                                    if (item.category === 'EFFECT') isActive = user?.profile?.active_effect === item.item_data?.effect_key;
                                                    if (item.category === 'VICTORY') isActive = user?.profile?.active_victory === item.item_data?.victory_key;

                                                    return isActive ? (
                                                        <Button 
                                                            className="w-full h-9 text-xs font-medium"
                                                            variant="outline"
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await storeAPI.unequipItem(item.category);
                                                                    toast.success(res.data.message);
                                                                    await checkAuth();
                                                                } catch (err) {
                                                                    toast.error("Failed to unequip");
                                                                }
                                                            }}
                                                        >
                                                            Unequip
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            className="w-full h-9 text-xs font-medium"
                                                            variant="secondary"
                                                            onClick={async () => {
                                                                try {
                                                                    const res = await storeAPI.equipItem(item.id);
                                                                    toast.success(res.data.message);
                                                                    await checkAuth(); 
                                                                } catch (err) {
                                                                    toast.error("Failed to equip");
                                                                }
                                                            }}
                                                        >
                                                            Equip
                                                        </Button>
                                                    );
                                                })()
                                            ) : (
                                                <Button 
                                                    className="w-full h-9 text-xs font-medium"
                                                    disabled={item.is_owned || user?.profile?.xp < item.cost || purchasing === item.id}
                                                    variant={item.is_owned ? "secondary" : "default"}
                                                    onClick={() => handleBuy(item)}
                                                >
                                                    {purchasing === item.id ? (
                                                        <Loader2 className="animate-spin w-3 h-3" />
                                                    ) : item.is_owned ? (
                                                        "Owned"
                                                    ) : user?.profile?.xp < item.cost ? (
                                                        <span className="flex items-center gap-1.5 opacity-70">
                                                            <Lock size={12} /> {item.cost.toLocaleString()} XP
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5">
                                                            Buy {item.cost.toLocaleString()} XP
                                                        </span>
                                                    )}
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Store;
