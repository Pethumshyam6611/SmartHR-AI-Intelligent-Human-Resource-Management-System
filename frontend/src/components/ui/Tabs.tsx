import { ReactNode, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-border">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium
                border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-500'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
                }
              `}
            >
              {tab.icon && tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">{activeContent}</div>
    </div>
  );
}
