import { useEffect, useMemo, useState } from 'react';
import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { Dropdown } from '../components/ui-kit/Dropdown';
// import { ButtonBasket } from '../components/ui-kit/ButtonBasket';

import './design-style.css';
import { useMaterialOptions } from '../hooks/useMaterialOptions';
import { useStyleOptions } from '../hooks/useStyleOptions';
import { formatCurrency } from '../utils/currency';

const parseDimensionValue = (value: string): number | null => {
  if (!value.trim()) {
    return null;
  }

  const normalizedValue = Number(value.replace(',', '.'));
  if (Number.isNaN(normalizedValue) || normalizedValue <= 0) {
    return null;
  }

  return normalizedValue;
};

export const DesignPage = () => {
  const { materialOptions, selectedMaterial, setSelectedMaterial } = useMaterialOptions();
  const { styleOptions, selectedStyle, setSelectedStyle } = useStyleOptions();
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');

  useEffect(() => {
    // Preselect material matching ?materialId=... if provided
    if (typeof window === 'undefined') {
      return;
    }

    if (selectedMaterial || materialOptions.length === 0) {
      return;
    }

    const materialIdFromUrl = new URLSearchParams(window.location.search).get('materialId');
    if (!materialIdFromUrl) {
      return;
    }

    const parsedMaterialId = Number(materialIdFromUrl);
    if (Number.isNaN(parsedMaterialId)) {
      return;
    }

    const matchedOption = materialOptions.find((option) => option.id === parsedMaterialId);
    if (matchedOption) {
      setSelectedMaterial(matchedOption);
    }
  }, [materialOptions, selectedMaterial, setSelectedMaterial]);

  const widthValue = useMemo(() => parseDimensionValue(widthCm), [widthCm]);
  const heightValue = useMemo(() => parseDimensionValue(heightCm), [heightCm]);

  const totalPrice = useMemo(() => {
    if (!selectedMaterial || !selectedStyle || widthValue == null || heightValue == null) {
      return null;
    }

    const price = (widthValue + heightValue) * selectedMaterial.pricePerCm * selectedStyle.coefficient;
    return Math.round(price);
  }, [heightValue, selectedMaterial, selectedStyle, widthValue]);

  const priceLabel = totalPrice == null ? '-' : formatCurrency(totalPrice);

  return (
    <div className="DesignPage">
      <Menu />
      <MainWrapper>
        <Header />

        <div className="design-constructor-text">
          <h2 className="anonymous-pro-bold home-text-block__md ">
            Дизайн-конструктор багета позволит Вам создать свою, уникальную раму. После оформления заказа специалист
            свяжется с Вами для уточнения деталей, предложит возможные варианты и эскизы выполнения.
          </h2>
        </div>

        <div className="design-constructor-wrapper">
          <div className="design-constructor_block-wrapper">
            <div className="design-constructor_title">
              <h2 className="anonymous-pro-bold home-text-block__xl ">Дизайн-</h2>
              <h2 className="anonymous-pro-bold home-text-block__xl_white ">конструктор</h2>
            </div>

            {/* <ButtonFavorites frameData={frameData} /> */}
          </div>

          <div className="design-constructor_block-wrapper">
            <div className="design-constructor_content-wrapper_text">
              <div className="design-constructor_content-wrapper_text_double">
                <div className="design-constructor_content-wrapper_text_single">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="0.1"
                    className="anonymous-pro-bold home-text-block__md__left data-text-input"
                    placeholder={'Ширина (см)'}
                    value={widthCm}
                    onChange={(event) => setWidthCm(event.target.value)}
                  />
                </div>
                <div className="design-constructor_content-wrapper_text_single">
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    step="0.1"
                    className="anonymous-pro-bold home-text-block__md__left data-text-input"
                    placeholder={'Высота (см)'}
                    value={heightCm}
                    onChange={(event) => setHeightCm(event.target.value)}
                  />
                </div>
              </div>

              <Dropdown
                className="anonymous-pro-bold"
                labelClassName="anonymous-pro-bold home-text-block__md_white"
                title="Материал"
                options={materialOptions}
                selectedItem={selectedMaterial}
                setSelectedItem={setSelectedMaterial}
              />

              <Dropdown
                className="anonymous-pro-bold"
                labelClassName="anonymous-pro-bold home-text-block__md_white"
                title="Стиль"
                options={styleOptions}
                selectedItem={selectedStyle}
                setSelectedItem={setSelectedStyle}
              />
            </div>
            {/* <ButtonBasket frameData={frameData}  /> */}
          </div>

          <div className="design-constructor_block-wrapper">
            <h2 className="anonymous-pro-bold home-text-block__md__left ">Итого:</h2>
            <h2 className="anonymous-pro-bold home-text-block__md__left ">{priceLabel}</h2>
          </div>
        </div>
      </MainWrapper>
      <Footer />
    </div>
  );
};
