import React, { useState } from 'react';
import { Plus, X, Newspaper, ExternalLink, Download } from 'lucide-react';
import openai from '../lib/openai';
import { generatePDF } from '../utils/pdfGenerator';

type NewsSource = {
  name: string;
  isDefault?: boolean;
  enabled: boolean;
};

export const NewsHeadlines = () => {
  const defaultSources: NewsSource[] = [
    { name: 'Business Standard', isDefault: true, enabled: true },
    { name: 'Economic Times', isDefault: true, enabled: true },
    { name: 'Mint', isDefault: true, enabled: true }
  ];

  const [newsSources, setNewsSources] = useState<NewsSource[]>(defaultSources);
  const [newSource, setNewSource] = useState('');
  const [headlines, setHeadlines] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSource = () => {
    if (newSource && !newsSources.find(s => s.name.toLowerCase() === newSource.toLowerCase())) {
      setNewsSources([...newsSources, { name: newSource, enabled: true }]);
      setNewSource('');
    }
  };

  const handleRemoveSource = (sourceName: string) => {
    const source = newsSources.find(s => s.name === sourceName);
    if (!source?.isDefault) {
      setNewsSources(newsSources.filter(s => s.name !== sourceName));
      const updatedHeadlines = { ...headlines };
      delete updatedHeadlines[sourceName];
      setHeadlines(updatedHeadlines);
    }
  };

  const toggleSource = (sourceName: string) => {
    setNewsSources(sources =>
      sources.map(source =>
        source.name === sourceName ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const fetchHeadlines = async () => {
    setIsLoading(true);
    const updatedHeadlines: Record<string, string[]> = {};
    try {
      for (const source of newsSources.filter(s => s.enabled)) {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a financial news curator. Generate 5 recent headlines from the specified news source. Each headline should be concise and focus on business/market news."
            },
            {
              role: "user",
              content: `Generate 5 recent business headlines from ${source.name}. Format each headline with a 📝 emoji at the start.`
            }
          ],
          model: "gpt-3.5-turbo",
        });

        const content = completion.choices[0].message.content;
        if (content) {
          updatedHeadlines[source.name] = content.split('\n').filter(line => line.trim());
        }
      }
      setHeadlines(updatedHeadlines);
    } catch (error) {
      console.error('Error fetching headlines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-[#e5e7eb]/50 dark:border-gray-700/50 shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#2563eb] to-[#7c3aed]">
            News Headlines
          </h2>
          {Object.keys(headlines).length > 0 && (
            <button
              onClick={() => generatePDF('headlines', Object.entries(headlines))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2563eb]/10 hover:bg-[#2563eb]/15 text-[#2563eb] transition-colors"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          )}
        </div>
        <button
          onClick={fetchHeadlines}
          disabled={isLoading}
          className="bg-[#2563eb]/10 hover:bg-[#2563eb]/15 dark:bg-[#2563eb]/20 dark:hover:bg-[#2563eb]/25 text-[#2563eb] dark:text-[#60a5fa] px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label={isLoading ? 'Generating headlines...' : 'Generate headlines'}
        >
          <Newspaper className="w-4 h-4" />
          {isLoading ? 'Generating...' : 'Generate Headlines'}
        </button>
      </div>

      {/* News Sources Selection */}
      <div className="mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsSources.map((source) => (
            <div
              key={source.name}
              onClick={() => toggleSource(source.name)}
              className={`
                px-4 py-3 rounded-lg border transition-all duration-200
                flex items-center justify-between cursor-pointer
                ${source.enabled
                  ? 'bg-[#2563eb]/10 border-[#2563eb]/30 text-[#2563eb]'
                  : 'bg-gray-50 border-gray-200 text-[#64748b]'
                }
              `}
            >
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${source.enabled ? 'bg-[#2563eb]' : 'bg-[#64748b]'}`} />
                {source.name}
              </span>
              {!source.isDefault && (
                <button
                  onClick={() => handleRemoveSource(source.name)}
                  className="hover:text-red-400 p-1 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Custom Source */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
            placeholder="Add custom news source..."
          />
          <button
            onClick={handleAddSource}
            className="bg-[#2563eb]/10 hover:bg-[#2563eb]/15 text-[#2563eb] px-4 rounded-lg flex items-center transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Headlines Display */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 border border-[#e5e7eb]/50 dark:border-gray-700/50 shadow-lg transition-all duration-300 space-y-6">
        {Object.entries(headlines).map(([source, sourceHeadlines]) => (
          <div key={source} className="bg-white dark:bg-gray-900 border border-[#e5e7eb] dark:border-gray-700 rounded-lg p-6 shadow-sm transition-all duration-300">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-[#2563eb]">
              {source}
              <ExternalLink className="w-4 h-4 text-[#2563eb]" />
            </h3>
            <ul className="space-y-3 list-none">
              {sourceHeadlines.map((headline, index) => (
                <li key={index} className="text-[#374151] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors duration-200">
                  {headline}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};