import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopButton = () => {
    const navigate = useNavigate();
    return (
        <div className="fixed left-6 bottom-6 z-30">
            <button 
                onClick={() => navigate('/store')}
                className="group relative"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                
                {/* Button Content */}
                <div className="relative bg-[#121212] border border-orange-500/30 hover:border-orange-500/80 rounded-full p-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-2xl">
                    <div className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-900/50">
                        <ShoppingBag size={28} className="ml-0.5" />
                    </div>
                </div>
            </button>
        </div>
    );
};

export default ShopButton;
