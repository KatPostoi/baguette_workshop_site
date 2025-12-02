import type { ReactNode } from 'react';
import './main-wrapper.css';

type MainWrapperProps = {
  children: ReactNode;
};

export const MainWrapper = ({ children }: MainWrapperProps) => {
  return <div className="main-wrapper">{children}</div>;
};
