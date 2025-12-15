import classNames from "classnames";
import { Dropdown } from "../../../ui-kit/Dropdown";
import type { MaterialOption } from "../../../../hooks/useMaterialOptions";
import type { StyleOption } from "../../../../hooks/useStyleOptions";

import "./catalog-filters.css";

type CatalogFiltersProps = {
  favoritesOnly: boolean;
  onFavoritesToggle: () => void;
  materialOptions: Array<MaterialOption>;
  selectedMaterial: MaterialOption;
  onMaterialSelect: (option: MaterialOption) => void;
  styleOptions: Array<StyleOption>;
  selectedStyle: StyleOption;
  onStyleSelect: (option: StyleOption) => void;
};

export const CatalogFilters = ({
  favoritesOnly,
  onFavoritesToggle,
  materialOptions,
  selectedMaterial,
  onMaterialSelect,
  styleOptions,
  selectedStyle,
  onStyleSelect,
}: CatalogFiltersProps) => {
  return (
    <div className="catalog-filters">
      <button
        type="button"
        className={classNames(
          "catalog-filters__favorites-button",
          "nav-menu__item",
          "anonymous-pro-bold",
          { "nav-menu__item_active": favoritesOnly }
        )}
        onClick={onFavoritesToggle}
      >
        Избранное
      </button>

      <Dropdown
        className="catalog-filters__dropdown"
        labelClassName="anonymous-pro-bold home-text-block__md__left"
        title="Материал"
        options={materialOptions}
        selectedItem={selectedMaterial}
        setSelectedItem={onMaterialSelect}
        variant="circle"
        fullWidth={false}
      />

      <Dropdown
        className="catalog-filters__dropdown"
        labelClassName="anonymous-pro-bold home-text-block__md__left"
        title="Стиль"
        options={styleOptions}
        selectedItem={selectedStyle}
        setSelectedItem={onStyleSelect}
        variant="circle"
        fullWidth={false}
      />
    </div>
  );
};
