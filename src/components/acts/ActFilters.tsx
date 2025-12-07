import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterOptions, sponsors, categories } from "@/data/mockData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { t } from "i18next";

interface ActFiltersProps {
  filters: {
    title: string;
    category: string;
    status: string;
    progress: string;
    sponsor: string;
    typAktu: string;
    kadencja: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function ActFilters({
  filters,
  onFilterChange,
  onReset,
}: ActFiltersProps) {
  const [isOpen, setIsOpen] = useState(true);

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== "all"
  );

  return (
    <div className="gov-card mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 p-0 h-auto hover:bg-transparent"
            >
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">
                {t("actfilters.filters", "Filtry")}
              </h3>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Wyczyść filtry
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Title search */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.title", "Tytuł")}
              </label>
              <Input
                placeholder="Szukaj po tytule..."
                value={filters.title}
                onChange={(e) => onFilterChange("title", e.target.value)}
                className="h-11"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.categories", "Kategorie")}
              </label>
              <Select
                value={filters.category}
                onValueChange={(v) => onFilterChange("category", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Wszystkie kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kategorie</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.status", "Status")}
              </label>
              <Select
                value={filters.status}
                onValueChange={(v) => onFilterChange("status", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Wszystkie statusy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie statusy</SelectItem>
                  {filterOptions.status.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.progress", "Postęp prac")}
              </label>
              <Select
                value={filters.progress}
                onValueChange={(v) => onFilterChange("progress", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Wszystkie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie</SelectItem>
                  {filterOptions.postep.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Typ aktu */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.acttype", "Rodzaj aktu")}
              </label>
              <Select
                value={filters.typAktu}
                onValueChange={(v) => onFilterChange("typAktu", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Wszystkie typy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie typy</SelectItem>
                  {filterOptions.typAktu.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Wnioskodawca */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.applicant", "Wnioskodawca")}
              </label>
              <Select
                value={filters.sponsor}
                onValueChange={(v) => onFilterChange("sponsor", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Wszyscy wnioskodawcy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszyscy wnioskodawcy</SelectItem>
                  {sponsors.map((sponsor) => (
                    <SelectItem key={sponsor} value={sponsor}>
                      {sponsor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kadencja */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.cadence", "Kadencja")}
              </label>
              <Select
                value={filters.kadencja}
                onValueChange={(v) => onFilterChange("kadencja", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Wszystkie kadencje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wszystkie kadencje</SelectItem>
                  <SelectItem value="X">X kadencja</SelectItem>
                  <SelectItem value="IX">IX kadencja</SelectItem>
                  <SelectItem value="VIII">VIII kadencja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
