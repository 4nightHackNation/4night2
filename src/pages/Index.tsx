import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/home/CategoryCard";
import { FeaturedActs } from "@/components/home/FeaturedActs";
import { categories } from "@/data/mockData";
import { FileText, TrendingUp, Users } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Radar Legislacyjny
            </h1>
            <p className="text-lg lg:text-xl opacity-90 mb-6 leading-relaxed">
              Kompleksowe monitorowanie procesów legislacyjnych w Polsce. 
              Śledź zmiany prawne od momentu ich inicjacji aż po wejście w życie.
            </p>
            <div className="flex flex-wrap gap-6 text-sm lg:text-base">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span>179 aktów w procedowaniu</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>X kadencja Sejmu RP</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Otwarte konsultacje publiczne</span>
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
              Kategorie tematyczne
            </h2>
            <p className="text-muted-foreground">
              Przeglądaj akty prawne według obszarów tematycznych. Subskrybuj kategorie, aby otrzymywać powiadomienia.
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
              <h3 className="text-xl font-semibold mb-2">Pełna transparentność</h3>
              <p className="text-muted-foreground">
                Dostęp do wszystkich etapów procesu legislacyjnego - od prekonsultacji do publikacji w Dzienniku Ustaw.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiza wpływu</h3>
              <p className="text-muted-foreground">
                Zrozum skutki regulacji dla obywateli, przedsiębiorców i administracji publicznej.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partycypacja obywatelska</h3>
              <p className="text-muted-foreground">
                Bierz udział w konsultacjach publicznych i wpływaj na kształt prawa w Polsce.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
