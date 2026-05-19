import { useLanguage } from "@/context/LanguageContext";
import { FaLinkedin } from "react-icons/fa6";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xl font-bold text-white">
            <span className="text-primary">&lt;</span> OM <span className="text-primary">/&gt;</span>
          </span>
          <div className="flex items-center gap-3">
            <p className="text-sm text-text/30">
              &copy; {new Date().getFullYear()} {t("footer.copyright")}
            </p>
            <span className="text-text/20">|</span>
            <a
              href="https://www.linkedin.com/in/oscar-alexis-mejia-rodriguez/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text/30 hover:text-primary transition-colors"
              aria-label={t("footer.linkedin")}
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
            <span className="text-text/20">|</span>
            <a
              href="https://www.linkedin.com/company/jdkoutstandingtechnologies"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text/30 hover:text-primary transition-colors"
            >
              {t("footer.jdk")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
