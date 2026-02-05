
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Editor, { useMonaco } from '@monaco-editor/react';
import {
    ArrowLeft,
    RotateCcw,
    Save,
    Play,
    FileText,
    FileJson,
    FileCode,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

// Initial File Content
const initialFiles = {
    'cart.js': {
        name: 'cart.js',
        language: 'javascript',
        content: `class ShoppingCart {
  constructor() {
    this.items = [];
    this.taxRate = 0.08;
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
  }

  // BUG: Tax is not being calculated correctly
  calculateTotal() {
    const subtotal = this.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    return subtotal;
  }
}`
    },
    'product.js': {
        name: 'product.js',
        language: 'javascript',
        content: `class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}`
    },
    'README.md': {
        name: 'README.md',
        language: 'markdown',
        content: `# E-Commerce Cart Bug Fix

The CalculateTotal method is currently ignoring the tax rate. 
Please fix it so that it returns the subtotal plus tax.`
    }
};

const Ide = () => {
    const [activeFile, setActiveFile] = useState('cart.js');
    const [files, setFiles] = useState(initialFiles);
    const [output, setOutput] = useState('No output yet. Click "Run Tests" to execute your code.');
    const [isRunning, setIsRunning] = useState(false);
    const [testsPassed, setTestsPassed] = useState(false);

    // Initial theme setup on mount
    const handleEditorDidMount = (editor, monaco) => {
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#060606', // deeper dark
                'editor.lineHighlightBackground': '#ffffff08',
                'editorLineNumber.foreground': '#4b5563',
                'editorLineNumber.activeForeground': '#7c3aed',
            },
        });
        monaco.editor.setTheme('custom-dark');
    };

    const handleRunTests = () => {
        setIsRunning(true);
        setOutput('Initializing scenario tests...');

        setTimeout(() => {
            const code = files['cart.js'].content;
            // Simple string check simulation
            if (code.includes('subtotal * (1 + this.taxRate)') || code.includes('subtotal + (subtotal * this.taxRate)')) {
                setOutput(`🚀 Scenario Tests Passed!\n\n✔ Tax Logic: Correct\n✔ State Persistence: Stable\n✔ Multi-item Calculation: Verified\n\nAll tests passed successfully! ✨`);
                setTestsPassed(true);
            } else {
                setOutput(`❌ Scenario Tests Failed\n\n✖ Tax Logic: Error\n  Expected: 108.00\n  Received: 100.00\n\n💡 Hint: Ensure you add the tax (subtotal * taxRate) to the base amount.`);
            }
            setIsRunning(false);
        }, 1500);
    };

    const handleSubmit = () => {
        // Persist completion status
        const completedProjects = JSON.parse(localStorage.getItem('completedProjects') || '[]');
        const projectTitle = "E-Commerce Total Bug"; // This should ideally be dynamic based on the scenario

        if (!completedProjects.includes(projectTitle)) {
            completedProjects.push(projectTitle);
            localStorage.setItem('completedProjects', JSON.stringify(completedProjects));
        }

        alert('🎉 Scenario Submitted! Great job.');
        navigate('/dashboard');
    };

    const handleEditorChange = (value) => {
        setFiles(prev => ({
            ...prev,
            [activeFile]: {
                ...prev[activeFile],
                content: value
            }
        }));
    };

    return (
        <div className="relative h-screen flex flex-col bg-[#030303] text-white overflow-hidden font-sans">
            {/* Background Streaks */}
            <div className="bg-streaks">
                <div className="streak-1 opacity-20"></div>
                <div className="streak-2 opacity-20"></div>
            </div>

            {/* Header */}
            <header className="h-20 glass-dark border-b border-white/5 flex items-center justify-between px-8 flex-shrink-0 z-50 backdrop-blur-3xl">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="p-2 glass rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <h1 className="font-black text-lg tracking-tight uppercase">E-Commerce Total Fix</h1>
                            <span className="bg-yellow-500/10 text-yellow-500 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-500/20 shadow-lg neon-border-magenta">
                                Medium
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Scenario IDE v2.0</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white glass rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                        onClick={() => setFiles(initialFiles)}
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 glass-dark border border-white/10 hover:border-white/30 text-white rounded-xl transition-all text-xs font-black uppercase tracking-widest">
                        <Save size={16} /> Save
                    </button>
                    <button
                        onClick={handleRunTests}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-8 py-2.5 bg-white text-[#030303] hover:bg-slate-200 rounded-xl transition-all text-xs font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-white/20"
                    >
                        <Play size={16} fill="currentColor" /> {isRunning ? 'Running...' : 'Run Scenario'}
                    </button>

                    {testsPassed && (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-8 py-2.5 bg-magenta-500 text-white hover:bg-magenta-600 rounded-xl transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-magenta-500/20 neon-border-magenta animate-pulse"
                        >
                            <CheckCircle2 size={16} /> Submit Scenario
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Sidebar */}
                <aside className="w-72 glass-dark border-r border-white/5 flex flex-col flex-shrink-0 backdrop-blur-3xl">
                    <div className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Project Files</div>
                    <div className="flex-1 overflow-y-auto py-4">
                        {Object.keys(files).map((filename) => (
                            <button
                                key={filename}
                                onClick={() => setActiveFile(filename)}
                                className={`w-[90%] mx-auto mb-1 rounded-xl text-left px-4 py-3 flex items-center gap-3 text-sm transition-all ${activeFile === filename
                                    ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                {filename.endsWith('.js') ? <FileCode size={18} className="text-purple-400" /> : <FileText size={18} className="text-slate-400" />}
                                <span className="font-bold tracking-tight">{filename}</span>
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-white/5">
                        <div className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Scenario Constraints</div>
                        <div className="px-4 py-4 space-y-3">
                            <div className="p-4 glass rounded-2xl border-white/5 group hover:border-purple-500/30 transition-all">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">Tax Calculation</h4>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Tax rate (0.08) must be applied to the final subtotal.</p>
                            </div>
                            <div className="p-4 glass rounded-2xl border-white/5 opacity-50">
                                <h4 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">Edge Cases</h4>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">Handle null values and zero quantities safely.</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-[#060606]">
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            language={files[activeFile].language}
                            value={files[activeFile].content}
                            onChange={handleEditorChange}
                            theme="custom-dark"
                            options={{
                                minimap: { enabled: false },
                                padding: { top: 30 },
                                fontSize: 16,
                                fontFamily: "'JetBrains Mono', monospace",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                lineNumbers: 'on',
                                glyphMargin: false,
                                folding: true,
                                lineDecorationsWidth: 10,
                                lineNumbersMinChars: 3,
                            }}
                            onMount={handleEditorDidMount}
                        />
                    </div>

                    {/* Output Console */}
                    <div className="h-64 glass-dark border-t border-white/5 flex flex-col flex-shrink-0 backdrop-blur-3xl">
                        <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compiler Output</span>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Ready</span>
                            </div>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto text-slate-300 leading-relaxed scrollbar-hide">
                            <div className="text-slate-500 mb-2">$ scenario-shell --run-tests</div>
                            {output}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ide;
