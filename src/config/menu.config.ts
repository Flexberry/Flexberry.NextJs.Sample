import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';

import { ROUTES_CONFIG } from './routes.config';

export interface IMenuItem {
  title: string;
  path: string;
  icon?: string;
  children?: IMenuItem[];
}

export const MENU_CONFIG: IMenuItem[] = [
  {
    title: 'Главная',
    path: ROUTES_CONFIG.MAIN,
    icon: 'icon-point',
  },
  {
    title: 'Заседания',
    path: ROUTES_CONFIG.MEETING,
    icon: 'icon-point',
  },
  {
    title: 'Паспорта',
    path: ROUTES_CONFIG.LEGAL_ACT_PASSPORT,
    icon: 'icon-point',
  },
  {
    title: 'Отчеты',
    path: '',
    icon: 'icon-point',
    children: [
      {
        title: 'Деятельность депутата',
        path: '',
        icon: 'icon-point',
      },
      {
        title: 'Работа ЗС',
        path: '',
        icon: 'icon-point',
      },
    ],
  },
];
