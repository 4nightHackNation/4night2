import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/home/CategoryCard";
import { FeaturedActs } from "@/components/home/FeaturedActs";
import { categories } from "@/data/mockData";
import { FileText, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              {t("site.title")}
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-6 leading-relaxed">
              {t("site.description")}
            </p>
            <div className="flex flex-wrap gap-6 text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("stats.acts_in_progress", { count: 179 })}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t("stats.sejm_term", { term: 10 })}
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t("stats.open_consultations", { count: 12 })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              {t("categories.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("categories.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CategoryCard {...category} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Acts */}
      <FeaturedActs />

      {/* Info Section */}
      <section className="py-12 lg:py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("featured.full_transparency")}
              </h3>
              <p className="text-muted-foreground">
                {t("featured.full_transparency.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("featured.impact_analysis")}
              </h3>
              <p className="text-muted-foreground">
                {t("featured.impact_analysis.description")}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("featured.citizen_participation")}
              </h3>
              <p className="text-muted-foreground">
                {t("featured.citizen_participation.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
