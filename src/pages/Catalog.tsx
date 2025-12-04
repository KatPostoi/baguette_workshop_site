import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './catalog-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { useState } from 'react';

export const CatalogPage = () => {
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  const [isBasketActive, setIsBasketActive] = useState(false);

  const handleFavoriteToggle = () => {
    setIsFavoriteActive((prev) => !prev);
  };

  const handleBasketToggle = () => {
    setIsBasketActive((prev) => !prev);
  };

  return (
    <div className="CatalogPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Каталог" className="catalog-section">
          <div className="filter-wrapper">
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__md__left">Избранное</h2>
              <div className="filter-container_arrow"></div>
            </div>
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__md__left">Материал</h2>
              <div className="filter-container_arrow"></div>
            </div>
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__md__left">Стиль</h2>
              <div className="filter-container_arrow"></div>
            </div>
            <div className="filter-wrapper_button">
              <h2 className="anonymous-pro-bold home-text-block__md__left">Форма</h2>
              <div className="filter-container_arrow"></div>
            </div>
          </div>

          <div className="catalog-wrapper">
            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.1.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.2.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.3.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.4.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.5.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>
            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.6.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.7.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.8.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.9.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.10.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.11.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>

            <div className="catalog-wrapper_card">
              <button
                type="button"
                className="icon-image-container"
                onClick={handleFavoriteToggle}
                aria-pressed={isFavoriteActive}
              >
                <div className="icon-image">
                  <img
                    src={
                      isFavoriteActive
                        ? '../src/assets/images/favorites-active.svg'
                        : '../src/assets/images/favorites.svg'
                    }
                    alt="IconFavorites"
                  />
                </div>
              </button>
              <div className="catalog-wrapper_card_goods-image">
                <img src="../src/assets/images/catalog/2.12.png" alt="IconFavorites" />
              </div>
              <div className="catalog-wrapper_card_description">
                <div className="catalog-wrapper_card_description_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm">Деревянный багет</h2>
                  <h2 className="anonymous-pro-bold home-text-block__vsm_white">6144 руб./м.п</h2>
                </div>
                <button
                  type="button"
                  className="icon-image-container"
                  onClick={handleBasketToggle}
                  aria-pressed={isBasketActive}
                >
                  <div className="icon-image">
                    <img
                      src={
                        isBasketActive ? '../src/assets/images/basket-active.svg' : '../src/assets/images/basket.svg'
                      }
                      alt="IconBasket"
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </TopicSection>
      </MainWrapper>
      <Footer />
    </div>
  );
};
