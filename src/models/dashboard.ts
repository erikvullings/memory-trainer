import { ComponentTypes } from 'mithril';

export type IconType = () => string | string;

export type IconResolver = () => string;

export interface IDashboard {
  id: Dashboards;
  default?: boolean;
  hasNavBar?: boolean;
  title: string | (() => string);
  icon: string | IconResolver;
  iconClass?: string;
  route: string;
  visible: boolean | (() => boolean);
  component: ComponentTypes<any, any>;
}

export enum Dashboards {
  HOME = 'HOME',
  TRAIN = 'TRAIN',
  CAPABILITY = 'CAPABILITY',
  TAXONOMY = 'TAXONOMY',
  ABOUT = 'ABOUT',
  SETTINGS = 'SETTINGS',
  PREPARATION = 'PREPARATION',
  ASSESSMENT = 'ASSESSMENT',
  DEVELOPMENT = 'DEVELOPMENT',
  EVALUATION = 'EVALUATION',
  HELP = 'HELP',
}
