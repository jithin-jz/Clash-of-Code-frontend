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
                {/* Button Content */}
                <div className="relative bg-[#262626] border border-[#3a3a3a] hover:border-[#ef4444] rounded-full p-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#fb7185] via-[#ef4444] to-[#b91c1c] rounded-full flex items-center justify-center text-white">
                        <ShoppingBag size={28} className="ml-0.5" />
                    </div>
                </div>
            </button>
        </div>
    );
};

export default ShopButton;
