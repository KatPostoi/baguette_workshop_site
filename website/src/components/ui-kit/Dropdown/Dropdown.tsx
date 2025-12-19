import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import './dropdown.css';

type DropdownOptionObject = {
  id: string | number;
  label: string;
};

export type DropdownOption = string | DropdownOptionObject;

type DropdownProps<TOption extends DropdownOption> = {
  title: string;
  options: Array<TOption>;
  selectedItem?: TOption | null;
  setSelectedItem: (value: TOption) => void;
  className?: string;
  labelClassName?: string;
  variant?: 'line' | 'circle';
  fullWidth?: boolean;
};

const isDropdownOptionObject = (option: DropdownOption): option is DropdownOptionObject => {
  return typeof option === 'object' && option !== null;
};

const getOptionLabel = (option: DropdownOption) => (isDropdownOptionObject(option) ? option.label : option);

const getOptionKey = (option: DropdownOption) => (isDropdownOptionObject(option) ? option.id : option);

const isOptionSelected = (option: DropdownOption, selected?: DropdownOption | null) => {
  if (!selected) {
    return false;
  }

  if (typeof option === 'string' && typeof selected === 'string') {
    return option === selected;
  }

  if (isDropdownOptionObject(option) && isDropdownOptionObject(selected)) {
    return option.id === selected.id;
  }

  return false;
};

export const Dropdown = <TOption extends DropdownOption>({
  title,
  options,
  selectedItem,
  setSelectedItem,
  className,
  labelClassName,
  variant = 'line',
  fullWidth = true,
}: DropdownProps<TOption>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  const handleSelect = useCallback(
    (value: TOption) => {
      setSelectedItem(value);
      setIsOpen(false);
    },
    [setSelectedItem]
  );

  const label = selectedItem != null ? getOptionLabel(selectedItem) : title;

  return (
    <div
      className={classNames('ui-dropdown', className, {
        'ui-dropdown_full-width': fullWidth,
      })}
      ref={containerRef}
    >
      <button
        type="button"
        className={classNames('ui-dropdown__control', {
          'ui-dropdown__control_line': variant === 'line',
          'ui-dropdown__control_circle': variant === 'circle',
        })}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={classNames('ui-dropdown__label', labelClassName)}>{label}</span>
        <span
          aria-hidden="true"
          className={classNames('ui-dropdown__chevron', { 'ui-dropdown__chevron_open': isOpen })}
        />
      </button>

      {isOpen && options.length > 0 && (
        <ul className="ui-dropdown__list" role="listbox">
          {options.map((option) => (
            <li key={getOptionKey(option)}>
              <button
                type="button"
                className={classNames('ui-dropdown__option', {
                  'ui-dropdown__option_selected': isOptionSelected(option, selectedItem),
                })}
                onClick={() => handleSelect(option)}
              >
                {getOptionLabel(option)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
