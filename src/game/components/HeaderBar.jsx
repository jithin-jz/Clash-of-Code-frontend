import React from 'react';
import { ArrowLeft, Play, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';

const HeaderBar = ({ 
    title, 
    navigate, 
    isPyodideReady, 
    isRunning, 
    runCode 
}) => {
    return (
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#121212]">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                    <ArrowLeft className="text-gray-400" />
                </Button>
                <h1 className="font-bold text-lg">{title}</h1>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
                    <div className={`w-2 h-2 rounded-full ${isPyodideReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    {isPyodideReady ? 'Env Ready' : 'Loading...'}
                </div>
                <Button 
                    size="sm" 
                    onClick={runCode} 
                    disabled={!isPyodideReady || isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                >
                    {isRunning ? <Loader2 className="animate-spin w-4 h-4" /> : <><Play className="w-4 h-4 mr-2" /> Run / Submit</>}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(HeaderBar);
