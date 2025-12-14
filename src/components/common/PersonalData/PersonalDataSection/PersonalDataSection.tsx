import { useState } from 'react';
import { TopicSection } from '../../../common/TopicSection';
import { Button } from '../../../ui-kit/Button';
import { Dropdown } from '../../../ui-kit/Dropdown';
import type { DropdownOption } from '../../../ui-kit/Dropdown/Dropdown';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../../TopicSection/types';

import './personal-data-style.css';

const POL_OPTIONS: Array<DropdownOption> = [
  {
    id: '1',
    label: 'М',
  },
  {
    id: '2',
    label: 'Ж',
  },
];

export const PersonalDataSection = () => {
  const [selectedPol, setSelectedPol] = useState<DropdownOption>();
  return (
    <TopicSection className="personal-account-section">
      <TopicSectionTitle textPosition={TEXT_POSITION.LEFT}>Личный кабинет</TopicSectionTitle>
      <div className="personal-data-wrapper">
        <div className="design-constructor_content-wrapper_text_double">
          <div className="design-constructor_content-wrapper_text_single">
            <input
              type="text"
              className="anonymous-pro-bold home-text-block__md__left data-text-input"
              placeholder={'ФИО'}
            />
          </div>
          {/* <div className="design-constructor_content-wrapper_text_single">
            <h2 className="anonymous-pro-bold home-text-block__md_grey ">Пол</h2>
            <div className="filter-container_arrow"></div>
          </div> */}
          <Dropdown
            className="anonymous-pro-bold"
            labelClassName="anonymous-pro-bold home-text-block__md_grey"
            title="Пол"
            options={POL_OPTIONS}
            selectedItem={selectedPol}
            setSelectedItem={setSelectedPol}
          />
        </div>
        <div className="design-constructor_content-wrapper_text_single">
          <input
            type="text"
            className="anonymous-pro-bold home-text-block__md__left data-text-input"
            placeholder={'Телефон'}
          />
        </div>
        <div className="design-constructor_content-wrapper_text_single">
          <input
            type="text"
            className="anonymous-pro-bold home-text-block__md__left data-text-input"
            placeholder={'Email'}
          />
        </div>
        <div className="agreement-block">
          <input type="checkbox" className="square-agreement" />
          <h2 className="anonymous-pro-bold home-text-block__vsm ">
            Нажимая на кнопку, Вы даете согласие на обработку персональных данных. Подробную информацию об условиях
            обработки Ваших данных и Ваших правах можно найти в Политике конфиденциальности.
          </h2>
        </div>

        <Button>Сохранить</Button>
      </div>
    </TopicSection>
  );
};
