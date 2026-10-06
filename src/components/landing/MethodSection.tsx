"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, RotateCw, BookOpen, Sparkles, PenTool, Gamepad2 } from "lucide-react";
import { SectionTitle } from "@/components/shared/SectionTitle";
import { methodSteps } from "@/data";
import { cn } from "@/lib/utils";

const getMethodIcon = (emoji: string) => {
  const props = { className: "w-4 h-4" };
  switch (emoji) {
    case "🧠": return <Brain {...props} />;
    case "🔄": return <RotateCw {...props} />;
    case "📚": return <BookOpen {...props} />;
    case "✨": return <Sparkles {...props} />;
    case "📝": return <PenTool {...props} />;
    case "🎮": return <Gamepad2 {...props} />;
    default: return <BookOpen {...props} />;
  }
};

const getMethodIconLarge = (emoji: string) => {
  const props = { className: "w-12 h-12 text-[var(--ahe-purple)]" };
  switch (emoji) {
    case "🧠": return <Brain {...props} />;
    case "🔄": return <RotateCw {...props} />;
    case "📚": return <BookOpen {...props} />;
    case "✨": return <Sparkles {...props} />;
    case "📝": return <PenTool {...props} />;
    case "🎮": return <Gamepad2 {...props} />;
    default: return <BookOpen {...props} />;
  }
};

export function MethodSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="metode" className="section-padding bg-background">
      <div className="container-custom">
        <SectionTitle
          // badge="⚡ Metode Pembelajaran"
          title="Metode Belajar Baca "
          highlight="AHE"
          subtitle="Enam langkah terstruktur dan konsisten untuk hasil belajar membaca yang efektif, asyik, dan menyenangkan."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Steps List */}
          <div className="space-y-4">
            {methodSteps.map((step, i) => (
              <motion.button
                key={step.step}
                onClick={() => setActiveStep(i)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                  activeStep === i
                    ? "border-[var(--ahe-purple)] bg-[var(--ahe-purple-light)] shadow-md"
                    : "border-border bg-card hover:border-[var(--ahe-purple)]/40 hover:bg-muted/50"
                )}
              >
                {/* Step number */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm transition-all",
                    activeStep === i
                      ? "gradient-brand text-white shadow-md"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step.step}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0",
                      activeStep === i
                        ? "bg-[var(--ahe-purple)]/15 text-[var(--ahe-purple)]"
                        : "bg-muted text-muted-foreground/80"
                    )}>
                      {getMethodIcon(step.icon)}
                    </div>
                    <h3 className={cn(
                      "font-bold transition-colors",
                      activeStep === i ? "text-[var(--ahe-purple)]" : "text-foreground"
                    )}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {step.description}
                  </p>
                </div>

                {/* Active indicator */}
                {activeStep === i && (
                  <motion.div
                    layoutId="active-dot"
                    className="w-2 h-2 rounded-full bg-[var(--ahe-purple)] shrink-0 mt-2"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative rounded-3xl overflow-hidden"
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 ${methodSteps[activeStep].color} opacity-10 rounded-3xl`} />

                <div className="relative p-8 border border-border rounded-3xl bg-card shadow-lg">
                  {/* Big Icon */}
                  <motion.div
                    initial={{ scale: 0.8, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[var(--ahe-purple)]/10 border border-[var(--ahe-purple)]/10 flex items-center justify-center shadow-inner text-[var(--ahe-purple)]">
                      {getMethodIconLarge(methodSteps[activeStep].icon)}
                    </div>
                  </motion.div>

                  {/* Step badge */}
                  <div className="flex justify-center mb-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white ${methodSteps[activeStep].color}`}>
                      Tahap {methodSteps[activeStep].step} dari {methodSteps.length}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground text-center mb-4">
                    {methodSteps[activeStep].title}
                  </h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {methodSteps[activeStep].description}
                  </p>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mt-8">
                    {methodSteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={cn(
                          "rounded-full transition-all duration-300",
                          i === activeStep
                            ? "w-6 h-2.5 bg-[var(--ahe-purple)]"
                            : "w-2.5 h-2.5 bg-muted hover:bg-[var(--ahe-purple)]/40"
                        )}
                        aria-label={`Step ${i + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                      disabled={activeStep === 0}
                      className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Sebelumnya
                    </button>
                    <button
                      onClick={() => setActiveStep(Math.min(methodSteps.length - 1, activeStep + 1))}
                      disabled={activeStep === methodSteps.length - 1}
                      className="flex-1 py-2.5 rounded-xl gradient-brand text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 p-6 rounded-3xl bg-muted/50 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">Progress Metode Pembelajaran</span>
            <span className="text-sm text-muted-foreground">{activeStep + 1} / {methodSteps.length} tahap</span>
          </div>
          <div className="w-full h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-brand rounded-full"
              animate={{ width: `${((activeStep + 1) / methodSteps.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {methodSteps.map((step, i) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(i)}
                className={cn(
                  "text-xs transition-colors",
                  i <= activeStep ? "text-[var(--ahe-purple)] font-medium" : "text-muted-foreground"
                )}
              >
                {step.title}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
