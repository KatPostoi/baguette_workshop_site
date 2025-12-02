import { Menu } from '../components/common/Menu';
import { Footer } from '../components/common/Footer';
import './process-style.css';
import { MainWrapper } from '../components/common/MainWrapper';
import { TopicSection } from '../components/common/TopicSection';
import { MaterialsSection } from '../features/materials/MaterialsSection';
import { materialsSectionContent } from '../features/materials/materialsData';

export const ProcessPage = () => {
  return (
    <div className="ProcessPage">
      <Menu />
      <MainWrapper>
        <div className="process-header">
          <img className="process-header_image" src="../src/assets/images/block_header.png" alt="HeaderWallpaper" />
        </div>

        {/* <ProcessSection {...processSectionData}/> */}

        <TopicSection title="Процесс изготовления" className="process-section">
          <div className="process-section_cards-wrapper">
            <div className="process-section_card">
              <div className="process-section_card-facts">
                <div className="process-section_card-facts_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">
                    Обсуждение пожеланий клиента к раме, согласование характеристик, сроков и цены с последующим
                    подписанием договора для фиксации обязательств.
                  </h2>
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">
                    Обсуждение заказа и заключение договора
                  </h2>
                </div>
                <div className="process-section_card-number">
                  <h2 className="anonymous-pro-bold home-text-block__md">1</h2>
                </div>
              </div>

              <div className="process-section_card-facts">
                <div className="process-section_card-facts_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">
                    Предварительное ручное или цифровое обозначение основных форм, размеров и конструкции рамы для
                    визуализации идеи перед детальной проработкой.
                  </h2>
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">Создание эскиза рамы</h2>
                </div>
                <div className="process-section_card-number">
                  <h2 className="anonymous-pro-bold home-text-block__md">2</h2>
                </div>
              </div>

              <div className="process-section_card-facts">
                <div className="process-section_card-facts_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">
                    Финализация детального чертежа с точными размерами, после проверки и одобрения клиентом для перехода
                    к изготовлению.
                  </h2>
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">Утверждение чертежа рамы</h2>
                </div>
                <div className="process-section_card-number">
                  <h2 className="anonymous-pro-bold home-text-block__md">3</h2>
                </div>
              </div>

              <div className="process-section_card-facts">
                <div className="process-section_card-facts_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">
                    Резка сырья, формирование деталей, сварка или сборка и обработка для получения готовой конструкции.
                  </h2>
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">Изготовление рамы</h2>
                </div>
                <div className="process-section_card-number">
                  <h2 className="anonymous-pro-bold home-text-block__md">4</h2>
                </div>
              </div>

              <div className="process-section_card-facts">
                <div className="process-section_card-facts_text">
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">
                    Подготовка актов выполненных работ, счетов и отчетов о расходах для закрытия заказа и оплаты.
                  </h2>
                  <h2 className="anonymous-pro-bold home-text-block__sm_white">Оформление финансовой отчетности</h2>
                </div>
                <div className="process-section_card-number">
                  <h2 className="anonymous-pro-bold home-text-block__md">5</h2>
                </div>
              </div>
            </div>
            <div className="process-section_card">
              <img
                className="process-section_image"
                src="../src/assets/images/half_frame.png"
                alt="ProcessSectionImage"
              />
            </div>
          </div>
        </TopicSection>

        <MaterialsSection {...materialsSectionContent} />
      </MainWrapper>
      <Footer />
    </div>
  );
};
