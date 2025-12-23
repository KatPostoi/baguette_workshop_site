import { useEffect, useMemo, useState } from 'react';
import { TopicSection } from '../../../common/TopicSection';
import { Button } from '../../../ui-kit/Button';
import { Dropdown } from '../../../ui-kit/Dropdown';
import type { DropdownOption } from '../../../ui-kit/Dropdown/Dropdown';
import { TopicSectionTitle } from '../../TopicSection/TopicSectionTitle';
import { TEXT_POSITION } from '../../TopicSection/types';
import { useAuth } from '../../../../state/AuthContext';
import { updateProfileExtended, changePassword } from '../../../../api/users';
import { ApiError } from '../../../../api/httpClient';
import { normalizePhone } from '../../../../utils/phone';

import './personal-data-style.css';

const POL_OPTIONS: DropdownOption[] = [
  { id: 'M', label: 'Муж' },
  { id: 'F', label: 'Жен' },
];

export const PersonalDataSection = () => {
  const { user, refreshProfile } = useAuth();
  const [genderId, setGenderId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const fromUser = user?.gender ?? null;
    const fromStorage = window.localStorage.getItem('profile_gender');
    return fromUser ?? fromStorage;
  });
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email] = useState(user?.email ?? '');
  const [consent, setConsent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phonePlaceholder = useMemo(() => '+7XXXXXXXXXX', []);
  const initialPhone = useMemo(() => (user?.phone ? normalizePhone(user.phone) : ''), [user?.phone]);
  const selectedGenderOption = useMemo<DropdownOption | null>(() => {
    if (!genderId) return null;
    const found = POL_OPTIONS.find((option) => typeof option !== 'string' && option.id === genderId);
    return found ?? null;
  }, [genderId]);

  const hasChanges = useMemo(() => {
    const currentPhone = phone ? normalizePhone(phone) : '';
    const currentGender = genderId ?? '';
    return (
      (fullName ?? '') !== (user?.fullName ?? '') ||
      currentPhone !== (initialPhone ?? '') ||
      currentGender !== (user?.gender ?? '')
    );
  }, [fullName, phone, genderId, user?.fullName, user?.gender, initialPhone]);

  const handleSave = async () => {
    setStatus(null);
    setError(null);
    try {
      await updateProfileExtended({
        fullName: fullName.trim() || undefined,
        phone: phone ? normalizePhone(phone) : undefined,
        gender: genderId ?? undefined,
      });
      await refreshProfile();
      setConsent(false);
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

  useEffect(() => {
    if (genderId && typeof window !== 'undefined') {
      window.localStorage.setItem('profile_gender', genderId);
    }
  }, [genderId]);

  useEffect(() => {
    if (user?.gender) {
      setGenderId(user.gender);
    }
    setFullName(user?.fullName ?? '');
    setPhone(user?.phone ?? '');
    setConsent(false);
  }, [user?.gender, user?.fullName, user?.phone]);

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
            selectedItem={selectedGenderOption}
            setSelectedItem={(option) => {
              if (typeof option === 'string') {
                setGenderId(option);
                return;
              }
              setGenderId(String(option.id));
            }}
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
        {hasChanges ? (
          <>
            <div className="agreement-block">
              <input
                type="checkbox"
                className="square-agreement"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <h2 className="anonymous-pro-bold home-text-block__vsm ">
                Нажимая на кнопку, Вы даете согласие на обработку персональных данных. Подробную информацию об условиях
                обработки Ваших данных и Ваших правах можно найти в Политике конфиденциальности.
              </h2>
            </div>
            <Button onClick={handleSave} disabled={!consent}>
              Сохранить
            </Button>
          </>
        ) : null}

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
