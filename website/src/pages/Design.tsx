import { useEffect, useMemo, useState } from 'react';
import { Menu } from '../components/common/Menu';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MainWrapper } from '../components/common/MainWrapper';
import { Dropdown } from '../components/ui-kit/Dropdown';
import { Button } from '../components/ui-kit/Button';
// import { ButtonBasket } from '../components/ui-kit/ButtonBasket';

import './design-style.css';
import { useMaterialOptions } from '../hooks/useMaterialOptions';
import { useStyleOptions } from '../hooks/useStyleOptions';
import { formatCurrency } from '../utils/currency';
import { quoteCustomFrame, createCustomFrame } from '../api/customFrames';
import { useBasketContext } from '../state/BasketContext';
import { useAuth } from '../state/AuthContext';
import { useToast } from '../state/ToastContext';
import { useAuthModal } from '../state/AuthModalContext';
import { useCustomFrames } from '../hooks/useCustomFrames';
import { CustomFramesSection } from '../components/custom-frames/CustomFramesSection';

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
  const { materialOptions, selectedMaterial, setSelectedMaterial } =
    useMaterialOptions();
  const { styleOptions, selectedStyle, setSelectedStyle } = useStyleOptions();
  const [widthCm, setWidthCm] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addItem } = useBasketContext();
  const { user, status } = useAuth();
  const { open } = useAuthModal();
  const { success, error } = useToast();
  const {
    frames: customFrames,
    isLoading: customFramesLoading,
    error: customFramesError,
    reload,
    remove,
  } = useCustomFrames();

  useEffect(() => {
    // Preselect material matching ?materialId=... if provided
    if (typeof window === 'undefined') {
      return;
    }

    if (selectedMaterial || materialOptions.length === 0) {
      return;
    }

    const materialIdFromUrl = new URLSearchParams(window.location.search).get(
      'materialId'
    );
    if (!materialIdFromUrl) {
      return;
    }

    const parsedMaterialId = Number(materialIdFromUrl);
    if (Number.isNaN(parsedMaterialId)) {
      return;
    }

    const matchedOption = materialOptions.find(
      (option) => option.id === parsedMaterialId
    );
    if (matchedOption) {
      setSelectedMaterial(matchedOption);
    }
  }, [materialOptions, selectedMaterial, setSelectedMaterial]);

  const widthValue = useMemo(() => parseDimensionValue(widthCm), [widthCm]);
  const heightValue = useMemo(() => parseDimensionValue(heightCm), [heightCm]);

  useEffect(() => {
    const fetchQuote = async () => {
      if (
        !selectedMaterial ||
        !selectedStyle ||
        widthValue == null ||
        heightValue == null
      ) {
        setPrice(null);
        setQuoteError(null);
        return;
      }
      setQuoteLoading(true);
      setQuoteError(null);
      try {
        const { price: quoted } = await quoteCustomFrame({
          materialId: selectedMaterial.id,
          styleId: selectedStyle.id,
          widthCm: widthValue,
          heightCm: heightValue,
        });
        setPrice(quoted);
      } catch (err) {
        console.error(err);
        setQuoteError('Не удалось рассчитать стоимость');
        setPrice(null);
      } finally {
        setQuoteLoading(false);
      }
    };
    void fetchQuote();
  }, [heightValue, selectedMaterial, selectedStyle, widthValue]);

  const priceLabel = price == null ? '-' : formatCurrency(price);

  const canSave = Boolean(
    selectedMaterial &&
      selectedStyle &&
      widthValue &&
      heightValue &&
      price &&
      !quoteLoading
  );

  const handleSaveToBasket = async () => {
    if (!user) {
      if (status !== 'loading') {
        open('login', window.location.pathname);
      }
      return;
    }
    if (
      !selectedMaterial ||
      !selectedStyle ||
      widthValue == null ||
      heightValue == null ||
      price == null
    ) {
      error('Заполните параметры рамы');
      return;
    }
    setSaving(true);
    try {
      const frame = await createCustomFrame({
        materialId: selectedMaterial.id,
        styleId: selectedStyle.id,
        widthCm: widthValue,
        heightCm: heightValue,
        color: 'Индивидуальный',
        title: `Рама ${widthValue}x${heightValue}`,
      });
      await addItem({ customFrameId: frame.id });
      await reload();
      success('Рама сохранена и добавлена в корзину');
    } catch (err) {
      console.error(err);
      error('Не удалось сохранить раму');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="DesignPage">
      <Menu />
      <MainWrapper>
        <Header />

        <div className="design-constructor-text">
          <h2 className="anonymous-pro-bold home-text-block__md ">
            Дизайн-конструктор багета позволит Вам создать свою, уникальную
            раму. После оформления заказа специалист свяжется с Вами для
            уточнения деталей, предложит возможные варианты и эскизы выполнения.
          </h2>
        </div>

        <div className="design-constructor-wrapper">
          <div className="design-constructor_block-wrapper">
            <div className="design-constructor_title">
              <h2 className="anonymous-pro-bold home-text-block__xl ">
                Дизайн-
              </h2>
              <h2 className="anonymous-pro-bold home-text-block__xl_white ">
                конструктор
              </h2>
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
            <h2 className="anonymous-pro-bold home-text-block__md__left ">
              Итого:
            </h2>
            <h2 className="anonymous-pro-bold home-text-block__md__left ">
              {quoteLoading ? 'Расчет…' : priceLabel}
            </h2>
            {quoteError ? <p className="auth-error">{quoteError}</p> : null}
            <Button
              type="button"
              onClick={() => void handleSaveToBasket()}
              disabled={!canSave || saving}
            >
              {saving ? 'Сохраняем…' : 'Сохранить и добавить в корзину'}
            </Button>
          </div>
        </div>

        <CustomFramesSection
          title="Мои рамы"
          frames={customFrames}
          isLoading={customFramesLoading}
          error={customFramesError}
          emptyMessage={
            user
              ? 'У вас пока нет сохранённых рам из конструктора.'
              : 'Войдите, чтобы увидеть и сохранить свои кастомные рамы.'
          }
          onDelete={async (id) => {
            try {
              await remove(id);
              success('Рама удалена');
            } catch (err) {
              console.error(err);
              error('Не удалось удалить раму');
            }
          }}
        />
        {!customFramesLoading && customFrames.length === 0 && user ? (
          <Button
            type="button"
            onClick={() => void reload()}
            variant="secondary"
          >
            Обновить список
          </Button>
        ) : null}
      </MainWrapper>
      <Footer />
    </div>
  );
};
