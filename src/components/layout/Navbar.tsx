import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useSettings } from "@/hooks/useSettings";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

const NAV_LINKS = [
  { key: "nav.projects", href: "#projects" },
  { key: "nav.skills", href: "#skills" },
];

export function Navbar() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="text-xl font-bold text-white"
            aria-label={t("nav.home")}
          >
            <span className="text-primary">&lt;</span> {settings.initials} <span className="text-primary">/&gt;</span>
          </a>

          <div className="hidden md:flex items-center gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-text/60 hover:text-primary transition-colors"
              >
                {t(link.key)}
              </a>
            ))}
            <LanguageSwitcher />
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-bg hover:opacity-90 transition-all"
            >
              {t("nav.workTogether")}
            </a>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("nav.toggleMenu")}
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-surface border-t border-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-text/60 hover:text-primary transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.key)}
                </a>
              ))}
              <a
                href="#contact"
                className="block text-center px-4 py-2 rounded-lg bg-primary text-bg font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {t("nav.workTogether")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
