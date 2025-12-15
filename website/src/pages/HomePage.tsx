import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './home-style.css';
import { MainWrapper } from '../components/common/MainWrapper';

export const HomePage = () => {
  return (
    <div className="HomePage">
      <Menu />
      <MainWrapper>
        <img src="../src/assets/images/block_baguette.png" alt="Wallpaper" />

        <div className="home-text-block anonymous-pro-bold">
          <h2 className="home-text-block__md">
            Мы — “FRAME”, багетная мастерская, где искусство обрамления превращается в персонализированное решение для
            вашего интерьера и творчества. Наша миссия — помочь каждому клиенту подчеркнуть ценность произведений
            искусства, фотографий или памятных предметов с помощью идеально подобранного багета.
          </h2>
        </div>

        <div className="our_principe_wrapper">
          <h2 className="anonymous-pro-bold home-text-block__xl_white">
            Наши <br />
            принципы
          </h2>
          <div className="our_principe_card_wrapper">
            <div className="our_principe_card">
              <h2 className="anonymous-pro-bold home-text-block__sm">
                Индивидуальный подход. Мы не просто подбираем раму — мы создаём гармоничное обрамление, которое
                раскрывает суть произведения.
              </h2>
              <h2 className="anonymous-pro-bold home-text-block__sm">
                Качество материалов. Только проверенные поставщики и надёжные компоненты, обеспечивающие долговечность
                изделия.
              </h2>
              <img src="../src/assets/images/1.jpg" alt="ImageCardFirst" />
              <img src="../src/assets/images/2.jpg" alt="ImageCardSecond" />
            </div>
            <div className="our_principe_card">
              <h2 className="anonymous-pro-bold home-text-block__sm">
                Точность исполнения. Каждый заказ проходит многоступенчатый контроль качества — от раскроя до финальной
                сборки.
              </h2>
              <h2 className="anonymous-pro-bold home-text-block__sm">
                Гибкость решений. Готовы реализовать как типовые, так и самые нестандартные задумки.
              </h2>
              <img src="../src/assets/images/3.jpg" alt="ImageCardThird" />
              <img src="../src/assets/images/4.jpg" alt="ImageCardFourth" />
            </div>
            <div className="our_principe_card">
              <h2 className="anonymous-pro-bold home-text-block__sm">
                Уважение к срокам. Чтим договорённости и всегда информируем о статусе заказа.
              </h2>
            </div>
          </div>
        </div>
      </MainWrapper>
      <Footer />
    </div>
  );
};
