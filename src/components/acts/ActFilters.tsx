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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
                {t("actfilters.filters")}
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
              {t("actfilters.clear_filters")}
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Title search */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.title")}
              </label>
              <Input
                placeholder={t("actfilters.search_placeholder")}
                value={filters.title}
                onChange={(e) => onFilterChange("title", e.target.value)}
                className="h-11"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.categories")}
              </label>
              <Select
                value={filters.category}
                onValueChange={(v) => onFilterChange("category", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("actfilters.all_categories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("actfilters.all_categories")}
                  </SelectItem>
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
                {t("actfilters.status")}
              </label>
              <Select
                value={filters.status}
                onValueChange={(v) => onFilterChange("status", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("actfilters.all_statuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("actfilters.all_statuses")}
                  </SelectItem>
                  {filterOptions.status.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.progress")}
              </label>
              <Select
                value={filters.progress}
                onValueChange={(v) => onFilterChange("progress", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("actfilters.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("actfilters.all")}</SelectItem>
                  {filterOptions.postep.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Typ aktu */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.acttype")}
              </label>
              <Select
                value={filters.typAktu}
                onValueChange={(v) => onFilterChange("typAktu", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("actfilters.all_types")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("actfilters.all_types")}
                  </SelectItem>
                  {filterOptions.typAktu.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {t(opt.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Wnioskodawca */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("actfilters.applicant")}
              </label>
              <Select
                value={filters.sponsor}
                onValueChange={(v) => onFilterChange("sponsor", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("actfilters.all_applicants")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("actfilters.all_applicants")}
                  </SelectItem>
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
                {t("actfilters.cadence")}
              </label>
              <Select
                value={filters.kadencja}
                onValueChange={(v) => onFilterChange("kadencja", v)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t("actfilters.all_cadences")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("actfilters.all_cadences")}
                  </SelectItem>
                  <SelectItem value="X">
                    {t("actfilters.kadencja_X")}
                  </SelectItem>
                  <SelectItem value="IX">
                    {t("actfilters.kadencja_IX")}
                  </SelectItem>
                  <SelectItem value="VIII">
                    {t("actfilters.kadencja_VIII")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
