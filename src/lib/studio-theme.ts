import type { StudioThemeMode } from './cad-types';

export interface StudioChrome {
  pageBg: string;
  headerBg: string;
  hairline: string;
  panelBg: string;
  wellBg: string;
  ink: string;
  inkSoft: string;
  inkMute: string;
  inkFaint: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  primaryBtnBg: string;
  primaryBtnHover: string;
  primaryBtnInk: string;
}

export interface StageTheme {
  bg: number;
  fogNear: number;
  fogFar: number;
  pedestal: number;
  groundOpacity: number;
  hemiSky: number;
  hemiGround: number;
  hemiIntensity: number;
  keyColor: number;
  keyIntensity: number;
  fillColor: number;
  fillIntensity: number;
  exposure: number;
}

export interface StudioTheme {
  chrome: StudioChrome;
  stage: StageTheme;
}

const ACCENT = '#c96f4b';
const ACCENT_STRONG = '#d98560';

export const STUDIO_THEME: Record<StudioThemeMode, StudioTheme> = {
  dark: {
    chrome: {
      pageBg: '#161310',
      headerBg: '#1c1712',
      hairline: 'rgba(255,255,255,0.07)',
      panelBg: 'rgba(30,26,21,0.95)',
      wellBg: 'rgba(255,255,255,0.04)',
      ink: '#f2e9d8',
      inkSoft: '#d8cfbd',
      inkMute: '#a89e8d',
      inkFaint: '#6b6257',
      accent: ACCENT,
      accentSoft: '#d98f66',
      accentStrong: ACCENT_STRONG,
      primaryBtnBg: '#ede4d3',
      primaryBtnHover: '#ffffff',
      primaryBtnInk: '#221c14',
    },
    stage: {
      bg: 0x161310,
      fogNear: 500,
      fogFar: 1100,
      pedestal: 0x2a231b,
      groundOpacity: 0.3,
      hemiSky: 0xfff4e6,
      hemiGround: 0x2a2118,
      hemiIntensity: 0.55,
      keyColor: 0xffe9d2,
      keyIntensity: 1.6,
      fillColor: 0xd8dee9,
      fillIntensity: 0.3,
      exposure: 1.05,
    },
  },
  light: {
    chrome: {
      pageBg: '#ece5d4',
      headerBg: '#f4efe2',
      hairline: 'rgba(42,34,22,0.12)',
      panelBg: 'rgba(250,247,238,0.96)',
      wellBg: 'rgba(42,34,22,0.05)',
      ink: '#2a241c',
      inkSoft: '#4a4234',
      inkMute: '#857c6b',
      inkFaint: '#a8a091',
      accent: ACCENT,
      accentSoft: '#a85a36',
      accentStrong: ACCENT_STRONG,
      primaryBtnBg: '#2a241c',
      primaryBtnHover: '#171310',
      primaryBtnInk: '#f4efe2',
    },
    stage: {
      bg: 0xe8e1d0,
      fogNear: 550,
      fogFar: 1200,
      pedestal: 0xd6cbb4,
      groundOpacity: 0.22,
      hemiSky: 0xfffdf4,
      hemiGround: 0xcfc3ab,
      hemiIntensity: 0.75,
      keyColor: 0xfff4e0,
      keyIntensity: 1.35,
      fillColor: 0xe8ecf4,
      fillIntensity: 0.4,
      exposure: 1.0,
    },
  },
};
