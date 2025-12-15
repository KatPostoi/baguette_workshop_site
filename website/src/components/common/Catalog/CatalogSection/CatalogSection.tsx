import { useMemo, useState } from 'react';
import type { FrameItem } from '../../../../api/types';
import { TopicSection } from '../../../common/TopicSection';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { CatalogCard } from '../CatalogCard';
import { CatalogFilters } from '../CatalogFilters';
import { useMaterialOptions, type MaterialOption } from '../../../../hooks/useMaterialOptions';
import { useStyleOptions, type StyleOption } from '../../../../hooks/useStyleOptions';
import { useLikedFrames } from '../../../../hooks/useLikedFrames';
import { filterCatalogFrames } from '../../../../utils/catalogFilters';

import './catalog-section-style.css';

type CatalogSectionProps = {
  items: FrameItem[];
};

const ALL_MATERIAL_OPTION: MaterialOption = {
  id: '__all_materials',
  label: 'Все материалы',
  pricePerCm: 0,
};

const ALL_STYLE_OPTION: StyleOption = {
  id: '__all_styles',
  label: 'Все стили',
  coefficient: 0,
};

export const CatalogSection = ({ items }: CatalogSectionProps) => {
  const { materialOptions } = useMaterialOptions();
  const { styleOptions } = useStyleOptions();
  const likedFrames = useLikedFrames();

  const favoriteIds = useMemo(() => new Set(likedFrames.map((frame) => frame.id)), [likedFrames]);

  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [materialFilterId, setMaterialFilterId] = useState<string | null>(null);
  const [styleFilterId, setStyleFilterId] = useState<string | null>(null);

  const materialOptionsWithAll = useMemo(
    () => [ALL_MATERIAL_OPTION, ...materialOptions],
    [materialOptions],
  );

  const styleOptionsWithAll = useMemo(
    () => [ALL_STYLE_OPTION, ...styleOptions],
    [styleOptions],
  );

  const selectedMaterialOption = useMemo(
    () =>
      materialOptionsWithAll.find((option) => option.id === materialFilterId) ??
      ALL_MATERIAL_OPTION,
    [materialFilterId, materialOptionsWithAll],
  );

  const selectedStyleOption = useMemo(
    () => styleOptionsWithAll.find((option) => option.id === styleFilterId) ?? ALL_STYLE_OPTION,
    [styleFilterId, styleOptionsWithAll],
  );

  const filteredItems = useMemo(() => {
    const filters = {
      favoritesOnly,
      materialId:
        selectedMaterialOption.id === ALL_MATERIAL_OPTION.id
          ? null
          : selectedMaterialOption.id,
      styleId:
        selectedStyleOption.id === ALL_STYLE_OPTION.id ? null : selectedStyleOption.id,
    };

    return filterCatalogFrames(items, filters, favoriteIds);
  }, [favoritesOnly, favoriteIds, items, selectedMaterialOption, selectedStyleOption]);

  const handleMaterialSelect = (option: MaterialOption) => {
    setMaterialFilterId(option.id === ALL_MATERIAL_OPTION.id ? null : option.id);
  };

  const handleStyleSelect = (option: StyleOption) => {
    setStyleFilterId(option.id === ALL_STYLE_OPTION.id ? null : option.id);
  };

  return (
    <TopicSection className="catalog-section">
      <TopicSectionTitle>Каталог</TopicSectionTitle>

      <CatalogFilters
        favoritesOnly={favoritesOnly}
        onFavoritesToggle={() => setFavoritesOnly((prev) => !prev)}
        materialOptions={materialOptionsWithAll}
        selectedMaterial={selectedMaterialOption}
        onMaterialSelect={handleMaterialSelect}
        styleOptions={styleOptionsWithAll}
        selectedStyle={selectedStyleOption}
        onStyleSelect={handleStyleSelect}
      />

      {filteredItems.length === 0 ? (
        <p className="catalog-section__empty-message anonymous-pro-bold home-text-block__md__left">
          Нет товаров, удовлетворяющих условиям фильтра.
        </p>
      ) : (
        <div className="catalog-wrapper">
          {filteredItems.map((item) => (
            <CatalogCard key={item.id} frameData={item} />
          ))}
        </div>
      )}
    </TopicSection>
  );
};
