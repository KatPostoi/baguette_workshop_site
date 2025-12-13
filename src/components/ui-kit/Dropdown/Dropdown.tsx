import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

import './dropdown.css';

type DropdownProps = {
  title: string;
  options: string[];
  selectedItem?: string | null;
  setSelectedItem: (value: string) => void;
  className?: string;
  labelClassName?: string;
};

export const Dropdown = ({
  title,
  options,
  selectedItem,
  setSelectedItem,
  className,
  labelClassName,
}: DropdownProps) => {
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
    (value: string) => {
      setSelectedItem(value);
      setIsOpen(false);
    },
    [setSelectedItem],
  );

  const label = selectedItem ?? title;

  return (
    <div className={classNames('ui-dropdown', className)} ref={containerRef}>
      <button
        type="button"
        className="ui-dropdown__control"
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
            <li key={option}>
              <button
                type="button"
                className={classNames('ui-dropdown__option', {
                  'ui-dropdown__option_selected': option === selectedItem,
                })}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
