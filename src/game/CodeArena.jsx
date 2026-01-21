import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, ArrowLeft, Loader2, Save, Bot, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import useAIStore from '../stores/useAIStore';
import ReactMarkdown from 'react-markdown';

const CodeArena = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('task'); // 'task' or 'ai'
    const [hint, setHint] = useState(null);
    const { generateHint, loading: aiLoading } = useAIStore();
    const [isPyodideReady, setPyodideReady] = useState(false);
    const pyodideRef = useRef(null);
    const editorRef = useRef(null);
    // Initial code template
    const [code, setCode] = useState(`# Level ${id} - Task
# Write your python code here
def solve():
    print("Hello from Level ${id}!")
solve()
`);
    // Load Pyodide
    useEffect(() => {
        const loadPyodide = async () => {
            try {
                // Check if script already exists to avoid duplicates
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
                        setOutput(prev => [...prev, { type: 'error', content: "Failed to initialize Python environment." }]);
                    }
                };
                document.body.appendChild(script);
            } catch (error) {
                console.error("Error loading Pyodide script:", error);
            }
        };
        loadPyodide();
    }, []);
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };
    const runCode = async () => {
        if (!pyodideRef.current || isRunning) return;
        
        setIsRunning(true);
        setOutput([]); // Clear previous output
        try {
            // Hijack stdout
            pyodideRef.current.setStdout({ batched: (msg) => {
                setOutput(prev => [...prev, { type: 'log', content: msg }]);
            }});
            
            // Run code
            await pyodideRef.current.runPythonAsync(code);
            
        } catch (error) {
            setOutput(prev => [...prev, { type: 'error', content: error.toString() }]);
        } finally {
            setIsRunning(false);
        }
    };
    return (
        <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#121212]">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/game')}>
                        <ArrowLeft className="text-gray-400" />
                    </Button>
                    <h1 className="font-bold text-lg">Level {id}: Python Basics</h1>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-xs font-medium">
                        <div className={`w-2 h-2 rounded-full ${isPyodideReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                        {isPyodideReady ? 'Environment Ready' : 'Loading Python...'}
                    </div>
                    <Button 
                        size="sm" 
                        onClick={runCode} 
                        disabled={!isPyodideReady || isRunning}
                        className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                    >
                        {isRunning ? <Loader2 className="animate-spin w-4 h-4" /> : <><Play className="w-4 h-4 mr-2" /> Run Code</>}
                    </Button>
                </div>
            </div>
            {/* removed AIDrawer */}
            {/* Main Content - Split Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Editor */}
                <div className="flex-1 border-r border-white/10 flex flex-col">
                     <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(value) => setCode(value)}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            padding: { top: 20 },
                            scrollBeyondLastLine: false,
                        }}
                     />
                </div>
                {/* Right: Output/Task */}
                {/* Right: Output/Task/AI */}
                <div className="w-1/3 bg-[#121212] flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-white/10">
                        <button 
                            onClick={() => setActiveTab('task')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'task' ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Task
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5' : 'text-gray-500 hover:text-purple-400/70'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Sparkles size={14} /> AI Hints
                            </div>
                        </button>
                    </div>

                    <div className="h-1/2 overflow-y-auto relative">
                        {activeTab === 'task' ? (
                            <div className="p-6">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Task Description</h2>
                                <div className="prose prose-invert prose-sm">
                                    <p>Write a python function that prints "Hello World".</p>
                                    <ul className="list-disc pl-4 text-gray-400">
                                        <li>Use the <code>print()</code> function.</li>
                                        <li>Ensure the output matches exactly.</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto mb-4">
                                    {!hint ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                            <Bot size={48} className="text-purple-500/30 mb-4" />
                                            <p className="text-gray-400 text-sm max-w-[200px]">
                                                Stuck? Ask the AI for a hint based on your current code.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3 text-purple-400 font-bold text-xs uppercase tracking-wider">
                                                <Sparkles size={12} /> AI Hint
                                            </div>
                                            <div className="prose prose-invert prose-sm text-sm text-gray-200">
                                                <ReactMarkdown>{hint}</ReactMarkdown>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <Button 
                                    onClick={async () => {
                                        const taskDesc = `Write a python function that prints "Hello World".`; // In real app, get this from props/state
                                        const result = await generateHint(taskDesc, code);
                                        setHint(result);
                                    }}
                                    disabled={aiLoading}
                                    className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20 border-0"
                                >
                                    {aiLoading ? (
                                        <><Loader2 className="animate-spin w-4 h-4 mr-2" /> Analyzing Code...</>
                                    ) : (
                                        <><Sparkles className="w-4 h-4 mr-2" /> Get Hint</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-1 flex flex-col bg-[#0a0a0a] border-t border-white/10">
                        <div className="px-4 py-2 border-b border-white/10 bg-[#1a1a1a]">
                            <span className="text-xs font-bold text-gray-500 uppercase">Console Output</span>
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-y-auto font-['Fira_Code']">
                            {output.length === 0 && <span className="text-gray-600 italic">Run your code to see output...</span>}
                            {output.map((line, i) => (
                                <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                                    {line.type === 'error' ? '❌ ' : '> '}
                                    {line.content}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CodeArena;