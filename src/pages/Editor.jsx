
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

    // Initial theme setup on mount
    const handleEditorDidMount = (editor, monaco) => {
        monaco.editor.defineTheme('custom-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#0f172a', // slate-900
            },
        });
        monaco.editor.setTheme('custom-dark');
    };

    const handleRunTests = () => {
        setIsRunning(true);
        setOutput('Running tests...');

        setTimeout(() => {
            const code = files['cart.js'].content;
            // Simple string check simulation
            if (code.includes('subtotal * (1 + this.taxRate)') || code.includes('subtotal + (subtotal * this.taxRate)')) {
                setOutput(`> Running Tests...
        
✔ Tax Calculation (Passed)
  Expected: 108.00
  Received: 108.00

✔ Multiple Items (Passed)
✔ Empty Cart (Passed)

All tests passed! 🚀`);
            } else {
                setOutput(`> Running Tests...
        
✖ Tax Calculation (Failed)
  Expected: 108.00
  Received: 100.00
  
  Hint: You are returning subtotal without adding tax.

✔ Multiple Items (Passed)
✔ Empty Cart (Passed)

Tests failed. Try again.`);
            }
            setIsRunning(false);
        }, 1000);
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
        <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden font-sans">
            {/* Header */}
            <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-1 text-sm font-medium">
                        <ArrowLeft size={16} /> Back
                    </Link>
                    <div className="h-6 w-px bg-slate-700"></div>
                    <div>
                        <h1 className="font-bold text-lg">E-Commerce Cart Bug Fix</h1>
                    </div>
                    <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-semibold border border-yellow-500/20">
                        Medium
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors text-sm font-medium"
                        onClick={() => setFiles(initialFiles)}
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium">
                        <Save size={16} /> Save
                    </button>
                    <button
                        onClick={handleRunTests}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play size={16} /> {isRunning ? 'Running...' : 'Run Tests'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
                    <div className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Project Files</div>
                    <div className="flex-1 overflow-y-auto">
                        {Object.keys(files).map((filename) => (
                            <button
                                key={filename}
                                onClick={() => setActiveFile(filename)}
                                className={`w-full text-left px-4 py-2 flex items-center gap-2 text-sm transition-colors ${activeFile === filename
                                        ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                {filename.endsWith('.js') ? <FileCode size={16} /> : <FileText size={16} />}
                                {filename}
                            </button>
                        ))}
                    </div>

                    <div className="border-t border-slate-800">
                        <div className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Test Cases</div>
                        <div className="px-2 pb-4 space-y-2">
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800">
                                <h4 className="text-sm font-semibold text-slate-300 mb-1">Tax Calculation</h4>
                                <p className="text-xs text-slate-500">Total should include tax added to subtotal</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 opacity-60">
                                <h4 className="text-sm font-semibold text-slate-300 mb-1">Multiple Items</h4>
                                <p className="text-xs text-slate-500">Should handle multiple items correctly</p>
                            </div>
                            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 opacity-60">
                                <h4 className="text-sm font-semibold text-slate-300 mb-1">Empty Cart</h4>
                                <p className="text-xs text-slate-500">Should return 0.00 for empty cart</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col min-w-0">
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
                                padding: { top: 20 },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                            onMount={handleEditorDidMount}
                        />
                    </div>

                    {/* Output Console */}
                    <div className="h-48 bg-black border-t border-slate-800 flex flex-col flex-shrink-0">
                        <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Output</span>
                        </div>
                        <div className="flex-1 p-4 font-mono text-sm overflow-auto text-slate-300 whitespace-pre-wrap">
                            {output}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ide;
