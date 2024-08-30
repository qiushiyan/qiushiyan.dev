"use client";

import { useState } from "react";

import { motion } from "framer-motion";

export const AnimatedTabs = ({
  tabs,
  onTabChange,
}: {
  tabs: { id: string; label: string }[];
  onTabChange: (id: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex space-x-1 pb-2">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => {
            setActiveTab(tab.id);
            onTabChange(tab.id);
          }}
          className={`${
            activeTab === tab.id ? "" : "hover:text-white/60"
          } relative rounded-full px-3 py-2 text-sm font-medium text-white outline-sky-400 transition focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {activeTab === tab.id && (
            <motion.span
              layoutId="bubble"
              className="absolute inset-0 z-10 bg-primary mix-blend-difference"
              style={{ borderRadius: 9999 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
};
