import { useState } from "react";
import { Button } from "@/components/ui/button";
import products from "../data/products";
import { useLanguage } from "@/hooks/useLanguage";

export default function SurpriseMe() {
  const [pick, setPick] = useState<(typeof products)[number] | null>(null);
  const [animate, setAnimate] = useState(false);
  const { t, language } = useLanguage(); // 👈 added language here

  const handleClick = () => {
    if (!products.length) return;
    const random = products[Math.floor(Math.random() * products.length)];
    setPick(random);

    // reset animation
    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);
  };

  return (
    <div className="space-y-4 text-center">
      <Button
        onClick={handleClick}
        className="bg-pink-600 hover:bg-pink-700"
        aria-label="Show a random product"
      >
        {t("surprise.button")}
      </Button>

      {pick && (
        <div
          className={`mx-auto mt-5 w-full max-w-sm rounded-2xl border bg-card text-card-foreground shadow-lg p-4
          transition-all duration-700 ease-out
          ${animate ? "animate-card-reveal" : ""}`}
        >
          <div className="text-xs mb-2 text-muted-foreground">{t("surprise.today")}</div>

          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-muted">
            <img
              src={pick.image}
              alt={language === "ar" ? pick.nameAr : pick.nameEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
          </div>

          <h3 className="mt-3 font-semibold text-center">
            {language === "ar" ? pick.nameAr : pick.nameEn}
          </h3>
        </div>
      )}
    </div>
  );
}
