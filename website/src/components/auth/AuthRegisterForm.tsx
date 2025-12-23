import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { Button } from '../ui-kit/Button';
import { Dropdown } from '../ui-kit/Dropdown';
import { normalizePhone } from '../../utils/phone';
import './AuthRegisterForm.css';

export type RegisterFormValues = {
  fullName: string;
  gender?: string;
  phone: string;
  email: string;
  password: string;
  consent: boolean;
  remember: boolean;
};

type AuthRegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => Promise<void> | void;
  loading?: boolean;
  serverError?: string | null;
  initialEmail?: string;
};

type GenderOption = { id: string; label: string };

const GENDER_OPTIONS: GenderOption[] = [
  { id: 'M', label: 'Муж' },
  { id: 'F', label: 'Жен' },
];

export const AuthRegisterForm = ({
  onSubmit,
  loading = false,
  serverError,
  initialEmail = '',
}: AuthRegisterFormProps) => {
  const [values, setValues] = useState<RegisterFormValues>({
    fullName: '',
    gender: undefined,
    phone: '',
    email: initialEmail,
    password: '',
    consent: false,
    remember: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormValues, string>>>({});

  const isSubmitDisabled = useMemo(() => loading, [loading]);

  const handleChange =
    (field: keyof RegisterFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === 'consent' || field === 'remember'
          ? event.target.checked
          : field === 'phone'
            ? normalizePhone(event.target.value)
            : event.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  const handleGenderChange = (option: GenderOption | null) => {
    setValues((prev) => ({ ...prev, gender: option?.id }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof RegisterFormValues, string>> = {};
    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Укажите ФИО';
    }
    if (!values.email.trim()) {
      nextErrors.email = 'Укажите email';
    }
    if (!values.password.trim()) {
      nextErrors.password = 'Задайте пароль';
    } else if (values.password.trim().length < 6) {
      nextErrors.password = 'Минимум 6 символов';
    }
    const phoneDigits = values.phone.replace(/\D/g, '');
    if (!phoneDigits) {
      nextErrors.phone = 'Укажите телефон';
    } else if (phoneDigits.length < 10) {
      nextErrors.phone = 'Слишком короткий телефон';
    }
    if (!values.consent) {
      nextErrors.consent = 'Требуется согласие';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }
    await onSubmit(values);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <div className="auth-grid">
        <div className="auth-field">
          <label className="auth-label" htmlFor="register-fullName">
            ФИО
          </label>
          <input
            id="register-fullName"
            name="fullName"
            className="auth-input"
            type="text"
            autoComplete="name"
            value={values.fullName}
            onChange={handleChange('fullName')}
            required
          />
          {errors.fullName ? <span className="auth-error">{errors.fullName}</span> : null}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="register-gender">
            Пол
          </label>
          <Dropdown
            title="Выберите"
            options={GENDER_OPTIONS}
            selectedItem={values.gender ? GENDER_OPTIONS.find((opt) => opt.id === values.gender) ?? null : null}
            setSelectedItem={handleGenderChange}
            variant="line"
            labelClassName="auth-label"
          />
        </div>
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="register-phone">
          Телефон
        </label>
        <input
          id="register-phone"
          name="phone"
          className="auth-input"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={handleChange('phone')}
          required
        />
        {errors.phone ? <span className="auth-error">{errors.phone}</span> : null}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="register-email">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          className="auth-input"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange('email')}
          required
        />
        {errors.email ? <span className="auth-error">{errors.email}</span> : null}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="register-password">
          Пароль
        </label>
        <input
          id="register-password"
          name="password"
          className="auth-input"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange('password')}
          required
        />
        {errors.password ? <span className="auth-error">{errors.password}</span> : null}
      </div>

      <label className="auth-checkbox">
        <input
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={handleChange('consent')}
          aria-describedby="register-consent"
        />
        <span className="auth-checkbox__text" id="register-consent">
          Нажимая на кнопку, Вы даете согласие на обработку персональных данных. Подробную информацию об условиях
          обработки Ваших данных и Ваших правах можно найти в Политике конфиденциальности.
        </span>
      </label>
      {errors.consent ? <span className="auth-error">{errors.consent}</span> : null}

      <label className="auth-checkbox">
        <input
          type="checkbox"
          name="remember"
          checked={values.remember}
          onChange={handleChange('remember')}
        />
        <span className="auth-checkbox__text">Запомнить меня</span>
      </label>

      {serverError ? <div className="auth-error">{serverError}</div> : null}

      <div className="auth-actions">
        <Button type="submit" disabled={isSubmitDisabled}>
          {loading ? 'Регистрируем…' : 'Зарегистрироваться'}
        </Button>
      </div>
    </form>
  );
};
