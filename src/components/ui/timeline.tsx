"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TimelineMilestone {
  year: string;
  badge: string;
  title: string;
  description: string;
  tag: string;
}

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

interface TimelineProps {
  milestones?: TimelineMilestone[];
  data?: TimelineEntry[];
  heading?: string;
  description?: string;
  badgeText?: string;
}

export function Timeline({
  milestones,
  data,
  heading,
  description,
  badgeText,
}: TimelineProps) {
  if (milestones && milestones.length > 0) {
    return (
      <div className="w-full bg-transparent font-sans">
        {(heading || badgeText) && (
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 px-4">
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold mb-3">
                <span>{badgeText}</span>
              </div>
            )}
            {heading && (
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {heading}
              </h3>
            )}
            {description && (
              <p className="text-slate-500 text-xs sm:text-sm md:text-base mt-2.5 max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Desktop Timeline (>= lg) */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 gap-5 mb-5 relative">
            <div className="absolute top-4 left-[12.5%] right-[12.5%] h-[2px] bg-slate-200 -translate-y-1/2 overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-purple-600 to-transparent shadow-[0_0_8px_rgba(147,51,234,0.6)]"
                animate={{ left: ["-15%", "105%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>

            {milestones.map((item, index) => (
              <div key={item.year} className="relative z-10 flex flex-col items-center">
                <motion.div
                  className="w-8 h-8 rounded-full bg-white border-2 border-purple-600 text-purple-700 flex items-center justify-center font-bold text-xs shadow-2xs"
                  animate={{
                    borderColor: ["#9333ea", "#c084fc", "#9333ea"],
                    boxShadow: [
                      "0 1px 2px rgba(0,0,0,0.05)",
                      "0 0 10px rgba(147,51,234,0.45)",
                      "0 1px 2px rgba(0,0,0,0.05)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.75,
                    ease: "easeInOut",
                  }}
                >
                  0{index + 1}
                </motion.div>
                <span className="mt-1.5 text-xs font-bold text-slate-800">
                  {item.year}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-5">
            {milestones.map((item) => (
              <div
                key={item.year}
                className="flex flex-col justify-between rounded-2xl p-5 bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                      {item.badge}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {item.year}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-slate-600 text-xs sm:text-[13px] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-700">
                  {item.tag}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Timeline (< lg) */}
        <div className="lg:hidden relative pl-8 space-y-4">
          <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-slate-200 overflow-hidden">
            <motion.div
              className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-purple-600 to-transparent shadow-[0_0_8px_rgba(147,51,234,0.6)]"
              animate={{ top: ["-15%", "105%"] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {milestones.map((item, index) => (
            <div key={item.year} className="relative">
              <motion.div
                className="absolute -left-8 top-3.5 w-7 h-7 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center text-xs font-bold text-purple-700 shadow-2xs"
                animate={{
                  borderColor: ["#9333ea", "#c084fc", "#9333ea"],
                  boxShadow: [
                    "0 1px 2px rgba(0,0,0,0.05)",
                    "0 0 10px rgba(147,51,234,0.45)",
                    "0 1px 2px rgba(0,0,0,0.05)",
                  ],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  delay: index * 0.7,
                  ease: "easeInOut",
                }}
              >
                0{index + 1}
              </motion.div>

              <div className="rounded-xl p-4 bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-slate-900">
                    {item.year}
                  </span>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {item.badge}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm mb-1.5">
                  {item.title}
                </h4>

                <p className="text-slate-600 text-xs leading-relaxed mb-3">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-slate-100 text-xs font-medium text-slate-700">
                  {item.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent font-sans">
      {(heading || badgeText) && (
        <div className="max-w-3xl mx-auto text-center mb-8 px-4">
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-3 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              <span>{badgeText}</span>
            </div>
          )}
          {heading && (
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {heading}
            </h3>
          )}
          {description && (
            <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <span className="text-xl font-black text-purple-700 mb-2 block">{item.title}</span>
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
