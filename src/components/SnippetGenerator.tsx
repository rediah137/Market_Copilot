import React, { useState } from 'react';
import { Plus, Send, X, Loader2, TrendingUp, Download } from 'lucide-react';
import openai from '../lib/openai';
import { generatePDF } from '../utils/pdfGenerator';

type SnippetType = 'pre-market' | 'noon' | 'closing' | 'post-market' | 'exception' | 'now';

export const SnippetGenerator = () => {
  const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
  const [newStock, setNewStock] = useState('');
  const [manualSnippets, setManualSnippets] = useState<string[]>([]);
  const [newManualSnippet, setNewManualSnippet] = useState('');
  const [generatedSnippet, setGeneratedSnippet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState<SnippetType | null>(null);

  const handleAddStock = () => {
    if (newStock && !selectedStocks.includes(newStock)) {
      setSelectedStocks([...selectedStocks, newStock]);
      setNewStock('');
    }
  };

  const handleRemoveStock = (stock: string) => {
    setSelectedStocks(selectedStocks.filter(s => s !== stock));
  };

  const handleAddManualSnippet = () => {
    if (newManualSnippet.trim()) {
      setManualSnippets([...manualSnippets, newManualSnippet.trim()]);
      setNewManualSnippet('');
    }
  };

  const handleRemoveManualSnippet = (snippet: string) => {
    setManualSnippets(manualSnippets.filter(s => s !== snippet));
  };

  const generatePrompt = (type: SnippetType) => {
    const currentTime = new Date().toLocaleTimeString('en-IN');
    const stocksContext = selectedStocks.length > 0 
      ? `\nPrioritize analysis for these stocks: ${selectedStocks.join(', ')}. ` 
      : '';
    const manualContext = manualSnippets.length > 0
      ? `\nImportant market updates to incorporate:\n${manualSnippets.map(s => `- ${s}`).join('\n')}\n\nEnsure these updates are properly categorized and integrated into the relevant sections below. Expand on their implications where appropriate.\n`
      : '';

    const basePrompt = `Generate a concise market snippet for Indian stock market ${type} update at ${currentTime}. ${stocksContext}${manualContext}

Format the response in a clean, structured way with the following sections:

📊 Market Overview
• Start with Nifty and Sensex status
• Include overall market sentiment
• Add key sector movements

📈 Key Movements
• List significant stock movements
• Include percentage changes
• Highlight volume trends

📰 Market Updates
• Add important market news
• Include corporate actions
• Mention any significant events

💡 Key Insights
• Provide actionable insights
• Highlight important levels
• Note any trading patterns

Use bullet points (•) and emojis for better readability. Keep each point concise and data-driven.`;

    return basePrompt;
  };

  const handleGenerateSnippet = async (type: SnippetType) => {
    setIsLoading(true);
    setActiveButton(type);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert financial analyst providing real-time market updates. Analyze and integrate all provided market updates into a cohesive narrative, explaining their impact on the market and individual stocks. Keep responses concise, factual, and focused on key market movements."
          },
          {
            role: "user",
            content: generatePrompt(type)
          }
        ],
        model: "gpt-3.5-turbo",
      });

      let formattedSnippet = completion.choices[0].message.content;
      // Remove any diff markers that might appear in the content
      formattedSnippet = formattedSnippet?.replace(/@@\s*\.\.\s*@@/g, '').trim() || 'No snippet generated';
      setGeneratedSnippet(formattedSnippet || 'No snippet generated');
    } catch (error) {
      console.error('Error generating snippet:', error);
      setGeneratedSnippet('Error generating snippet. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveButton(null);
    }
  };

  const snippetButtons = [
    { type: 'now', label: 'Now Snippet' },
    { type: 'pre-market', label: 'Pre-Market Snippet (before 9:15am)' },
    { type: 'noon', label: 'Noon Snippet (12pm)' },
    { type: 'closing', label: 'Market Closing Snippet (3pm)' },
    { type: 'post-market', label: 'Post-Market Snippet' },
    { type: 'exception', label: 'Exception Snippet' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-[#e5e7eb]/50 dark:border-gray-700/50 shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#7c3aed] mb-8">
          Generate Snippet
        </h2>
        
        {/* Stock Symbols Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#374151] dark:text-gray-300 mb-2">
            Add Stock Symbols
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(e.g., RELIANCE, TCS, INFY)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddStock()}
              className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 dark:focus:ring-[#2563eb]/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="Enter stock symbol"
              aria-label="Stock symbol input"
            />
            <button
              onClick={handleAddStock}
              className="bg-[#2563eb]/10 hover:bg-[#2563eb]/15 dark:bg-[#2563eb]/20 dark:hover:bg-[#2563eb]/25 text-[#2563eb] dark:text-[#60a5fa] px-4 rounded-lg flex items-center transition-all duration-200"
              aria-label="Add stock symbol"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Selected Stocks */}
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedStocks.map((stock) => (
              <span
                key={stock}
                className="bg-[#2563eb]/10 border border-[#2563eb]/30 px-4 py-1 rounded-full flex items-center gap-2 text-[#2563eb]"
              >
                {stock}
                <button
                  onClick={() => handleRemoveStock(stock)}
                  className="hover:text-[#be123c] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Manual Snippet Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#374151] dark:text-gray-300 mb-2">
            Add Market Update
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(Press Enter to add)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newManualSnippet}
              onChange={(e) => setNewManualSnippet(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddManualSnippet()}
              className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 dark:focus:ring-[#2563eb]/50 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="Enter market update or insight"
              aria-label="Market update input"
            />
            <button
              onClick={handleAddManualSnippet}
              className="bg-[#2563eb]/10 hover:bg-[#2563eb]/15 text-[#2563eb] px-4 rounded-lg flex items-center transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          {/* Manual Snippets List */}
          {manualSnippets.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {manualSnippets.map((snippet, index) => (
                <span
                  key={index}
                  className="bg-[#2563eb]/10 border border-[#2563eb]/30 px-4 py-1 rounded-full flex items-center gap-2 text-[#2563eb]"
                >
                {snippet}
                <button
                  onClick={() => handleRemoveManualSnippet(snippet)}
                  className="hover:text-[#be123c] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Snippet Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippetButtons.map((button) => (
            <button
              key={button.type}
              onClick={() => handleGenerateSnippet(button.type as SnippetType)}
              disabled={isLoading || (activeButton !== null && activeButton !== button.type)}
              className={`px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200
                ${activeButton === button.type
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#2563eb]/10 hover:bg-[#2563eb]/15 text-[#2563eb]'}
                ${(isLoading || (activeButton !== null && activeButton !== button.type))
                  ? 'opacity-50 cursor-not-allowed'
                  : ''}`}
            >
              {isLoading && activeButton === button.type ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Snippet */}
      {generatedSnippet && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-[#e5e7eb]/50 dark:border-gray-700/50 shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[#2563eb] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Snippet
            </h3>
            <button
              onClick={() => generatePDF('snippet', generatedSnippet)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2563eb]/10 hover:bg-[#2563eb]/15 text-[#2563eb] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-[#e5e7eb] dark:border-gray-700 rounded-lg p-6 shadow-sm space-y-6">
            <div className="whitespace-pre-wrap text-[#374151] dark:text-gray-300 prose dark:prose-invert max-w-none leading-relaxed">
              {generatedSnippet.split('\n\n').map((section, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  {section}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};