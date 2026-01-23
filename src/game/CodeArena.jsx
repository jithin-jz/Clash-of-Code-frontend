import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Sparkles, ArrowRight, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import useAIStore from '../stores/useAIStore';
import useAuthStore from '../stores/useAuthStore';
import CursorEffects from './CursorEffects';
import VictoryAnimation from './VictoryAnimation';

// Subcomponents
import HeaderBar from './components/HeaderBar';
import EditorPane from './components/EditorPane';
import ProblemPane from './components/ProblemPane';
import ConsolePane from './components/ConsolePane';

const CodeArena = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('task'); // 'task' or 'ai'
    const [hint, setHint] = useState(null);
    const { generateHint, loading: aiLoading } = useAIStore();
    const { user } = useAuthStore();
    const [isPyodideReady, setPyodideReady] = useState(false);
    const pyodideRef = useRef(null);
    const editorRef = useRef(null);

    // Initial code template
    const [code, setCode] = useState("");
    const [completionData, setCompletionData] = useState(null);

    // Fetch Challenge Data
    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                // Dynamic Import
                const { challengesApi } = await import('../services/challengesApi');
                const data = await challengesApi.getBySlug(id);
                setChallenge(data);
                setCode(data.initial_code || "");
                setHint(null);
            } catch (error) {
                console.error("Failed to load challenge:", error);
                setOutput([{ type: 'error', content: "Failed to load challenge data." }]);
            }
        };
        fetchChallenge();
    }, [id]);

    // Load Pyodide (Same as before)
    useEffect(() => {
        const loadPyodide = async () => {
            try {
                if (window.pyodide) {
                    pyodideRef.current = window.pyodide;
                    setPyodideReady(true);
                    return;
                }
                const script = document.createElement('script');
                script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
                script.async = true;
                script.onload = async () => {
                    try {
                        const pyodide = await window.loadPyodide();
                        pyodideRef.current = pyodide;
                        setPyodideReady(true);
                        console.log("Pyodide loaded");
                    } catch (err) {
                        console.error("Failed to initialize Pyodide:", err);
                    }
                };
                document.body.appendChild(script);
            } catch (error) {
                console.error("Error loading Pyodide script:", error);
            }
        };
        loadPyodide();
    }, []);

    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        
        // Define Custom Themes (Keeping these here as they are global to Monaco instance)
        monaco.editor.defineTheme('dracula', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6272a4' },
                { token: 'keyword', foreground: 'ff79c6' },
                { token: 'string', foreground: 'f1fa8c' },
                { token: 'number', foreground: 'bd93f9' },
                { token: 'type', foreground: '8be9fd' },
            ],
            colors: {
                'editor.background': '#282a36',
                'editor.foreground': '#f8f8f2',
                'editorCursor.foreground': '#f8f8f0',
                'editor.lineHighlightBackground': '#44475a',
                'editor.selectionBackground': '#44475a',
            }
        });

        // ... Note: Other themes definitions skipped for brevity but should be here if used ...
        // Keeping monokai/github-light definitions if needed, or assume they persist

        // Cursor Effect Hook
        editor.onDidChangeCursorPosition((e) => {
            if (user?.profile?.active_effect && window.spawnCursorEffect) {
                const scrolledVisiblePosition = editor.getScrolledVisiblePosition(e.position);
                if (scrolledVisiblePosition) {
                    const domNode = editor.getDomNode();
                    const rect = domNode.getBoundingClientRect();
                    const x = rect.left + scrolledVisiblePosition.left;
                    const y = rect.top + scrolledVisiblePosition.top;
                    window.spawnCursorEffect(x, y + 10); // Offset slightly
                }
            }
        });

        // Force re-layout or update if needed
        if (user?.profile?.active_theme) {
             monaco.editor.setTheme(user.profile.active_theme);
        }
    }, [user?.profile?.active_effect, user?.profile?.active_theme]);

    const runCode = useCallback(async () => {
        if (!pyodideRef.current || isRunning || !challenge) return;
        
        setIsRunning(true);
        setOutput([]); 
        try {
            // Hijack stdout
            pyodideRef.current.setStdout({ batched: (msg) => {
                setOutput(prev => [...prev, { type: 'log', content: msg }]);
            }});
            
            // Run User Code
            await pyodideRef.current.runPythonAsync(code);

            // Run Test Code (Hidden assertion)
            if (challenge.test_code) {
                await pyodideRef.current.runPythonAsync(challenge.test_code);
                // If assertions pass, we get here
                setOutput(prev => [...prev, { type: 'success', content: "✅ Tests Passed!" }]);
                
                // Submit to Backend
                const { challengesApi } = await import('../services/challengesApi');
                const result = await challengesApi.submit(id, { passed: true });
                
                if (result.status === 'completed' || result.status === 'already_completed') {
                    const starText = "⭐".repeat(result.stars || 0);
                    setOutput(prev => [...prev, { type: 'success', content: `🎉 Challenge Completed! ${starText}` }]);
                    if (result.xp_earned > 0) {
                         setOutput(prev => [...prev, { type: 'success', content: `💪 XP Earned: +${result.xp_earned}` }]);
                    }
                    
                    // Trigger Completion Modal
                    setTimeout(() => {
                        setCompletionData(result);
                    }, 500); // 500ms delay for effect
                }
            } else {
                 setOutput(prev => [...prev, { type: 'log', content: "⚠️ No tests defined. Code ran successfully." }]);
            }
            
        } catch (error) {
            setOutput(prev => [...prev, { type: 'error', content: `❌ ${error.toString()}` }]);
        } finally {
            setIsRunning(false);
        }
    }, [code, challenge, id, isRunning]);

    const handleGetHint = useCallback(async () => {
        try {
            const { challengesApi } = await import('../services/challengesApi');
            // Deduct XP
            await challengesApi.purchaseAIHint(id);
            
            // Generate Hint
            const taskDesc = challenge.description;
            const result = await generateHint(taskDesc, code);
            setHint(result);
            setOutput(prev => [...prev, { type: 'success', content: "💡 Hint Unlocked (-10 XP)" }]);
        } catch (error) {
            if (error.response?.status === 400) {
                setOutput(prev => [...prev, { type: 'error', content: "❌ Insufficient XP for Hint (Cost: 10 XP)" }]);
            } else {
                console.error(error);
            }
        }
    }, [id, challenge, code, generateHint]);

    // if (!challenge) return <div className="h-screen flex items-center justify-center bg-[#0a0a0a] text-white"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden relative">
            <CursorEffects effectType={user?.profile?.active_effect} />
            
            {/* Completion Modal */}
            {completionData && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                     <VictoryAnimation type={user?.profile?.active_victory} />
                     <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-md w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden z-[70]"
                     >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-linear-to-br from-green-500/10 via-purple-500/5 to-blue-500/10 pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                                <Sparkles size={40} className="text-green-400" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-white tracking-tight">Level Completed!</h2>
                            
                            <div className="flex gap-2 my-2">
                                {[1, 2, 3].map((star) => (
                                    <motion.div
                                        key={star}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: star * 0.2 }}
                                    >
                                        <div className={`w-12 h-12 flex items-center justify-center ${star <= completionData.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'}`}>
                                             <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="100%"
                                                height="100%"
                                                viewBox="0 0 24 24"
                                                fill={star <= completionData.stars ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                              >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                              </svg>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            
                            {completionData.xp_earned > 0 && (
                                <div className="bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-lg font-bold text-sm border border-yellow-500/20">
                                    +{completionData.xp_earned} XP Earned
                                </div>
                            )}
                            
                            <p className="text-gray-400 max-w-[250px] text-sm">
                                {completionData.status === 'already_completed' ? 'You have already mastered this level.' : 'Great job! You have unlocked the next challenge.'}
                            </p>
                            
                            <div className="flex flex-col w-full gap-3 mt-4">
                                {completionData.next_level_slug && (
                                    <Button 
                                        onClick={() => {
                                            navigate(`/level/${completionData.next_level_slug}`);
                                            setCompletionData(null); 
                                        }}
                                        className="w-full py-6 font-bold text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                                    >
                                        Next Level <ArrowRight />
                                    </Button>
                                )}
                                
                                <Button 
                                    variant={completionData.next_level_slug ? "outline" : "default"}
                                    onClick={() => navigate('/')}
                                    className={`w-full py-6 font-bold text-lg flex items-center justify-center gap-2 ${!completionData.next_level_slug ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'border-white/20 hover:bg-white/5 text-gray-300 hover:text-white'}`}
                                >
                                    <Home size={20} /> Go Home
                                </Button>
                            </div>
                        </div>
                     </motion.div>
                </div>
            )}

            <HeaderBar 
                title={challenge?.title || "Loading Challenge..."}
                navigate={navigate}
                isPyodideReady={isPyodideReady}
                isRunning={isRunning}
                runCode={runCode}
            />
            
            {/* Main Content - Split Layout */}
            <div className="flex-1 flex overflow-hidden">
                <EditorPane 
                    code={code}
                    setCode={setCode}
                    user={user}
                    handleEditorDidMount={handleEditorDidMount}
                    loading={!challenge}
                />
                
                {/* Right: Output/Task/AI */}
                <div className="w-1/3 flex flex-col">
                    <ProblemPane 
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        challenge={challenge}
                        hint={hint}
                        aiLoading={aiLoading}
                        onGetHint={handleGetHint}
                        id={id}
                        loading={!challenge}
                    />
                    <ConsolePane output={output} loading={!challenge} />
               </div>
            </div>
        </div>
    );
};
export default CodeArena;