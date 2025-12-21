import { useMemo, useState } from 'react';
import { TopicSection } from '../../../common/TopicSection';
import { Button } from '../../../ui-kit/Button';
import { Dropdown } from '../../../ui-kit/Dropdown';
import type { DropdownOption } from '../../../ui-kit/Dropdown/Dropdown';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../../TopicSection/types';
import { useAuth } from '../../../../state/AuthContext';
import { updateProfile, changePassword } from '../../../../api/users';
import { ApiError } from '../../../../api/httpClient';

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
  const { user, refreshProfile } = useAuth();
  const [selectedPol, setSelectedPol] = useState<DropdownOption>();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phonePlaceholder = useMemo(() => '+7XXXXXXXXXX', []);

  const normalizePhone = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    const normalized = digits.startsWith('7') ? digits : `7${digits}`;
    return `+${normalized}`;
  };

  const handleSave = async () => {
    setStatus(null);
    setError(null);
    try {
      await updateProfile({
        fullName: fullName.trim() || undefined,
        phone: phone ? normalizePhone(phone) : undefined,
      });
      await refreshProfile();
      setStatus('Данные обновлены');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось сохранить профиль';
      setError(message);
    }
  };

  const handleChangePassword = async () => {
    setStatus(null);
    setError(null);
    if (!currentPassword || !newPassword) {
      setError('Укажите текущий и новый пароль');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setStatus('Пароль обновлён');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Не удалось сменить пароль';
      setError(message);
    }
  };

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
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
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
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-label="Телефон"
            title={phonePlaceholder}
          />
        </div>
        <div className="design-constructor_content-wrapper_text_single">
          <input
            type="text"
            className="anonymous-pro-bold home-text-block__md__left data-text-input"
            placeholder={'Email'}
            value={email}
            disabled
          />
        </div>
        <div className="agreement-block">
          <input type="checkbox" className="square-agreement" />
          <h2 className="anonymous-pro-bold home-text-block__vsm ">
            Нажимая на кнопку, Вы даете согласие на обработку персональных данных. Подробную информацию об условиях
            обработки Ваших данных и Ваших правах можно найти в Политике конфиденциальности.
          </h2>
        </div>

        <Button onClick={handleSave}>Сохранить</Button>

        <div className="design-constructor_content-wrapper_text_double" style={{ marginTop: '1rem' }}>
          <div className="design-constructor_content-wrapper_text_single">
            <input
              type="password"
              className="anonymous-pro-bold home-text-block__md__left data-text-input"
              placeholder={'Текущий пароль'}
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </div>
          <div className="design-constructor_content-wrapper_text_single">
            <input
              type="password"
              className="anonymous-pro-bold home-text-block__md__left data-text-input"
              placeholder={'Новый пароль'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleChangePassword}>Сменить пароль</Button>
        {status ? <p className="anonymous-pro-bold home-text-block__vsm_green">{status}</p> : null}
        {error ? <p className="anonymous-pro-bold home-text-block__vsm_red">{error}</p> : null}
      </div>
    </TopicSection>
  );
};
