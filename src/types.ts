/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  designer: string;
  country: string;
  description: string;
  imageUrl: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
}

export type IsettaColor = 'seafoam' | 'yellow' | 'blue';

export interface IsettaState {
  color: IsettaColor;
  doorOpen: boolean;
}

export interface BraunState {
  isPlaying: boolean;
  frequency: number; // 88 - 108 MHz
  volume: number; // 0 - 10
  currentPreset: string;
}

export type BikeModel = 'arrow' | 'bixby' | 'runwell';

export interface BikeState {
  selectedModel: BikeModel;
  color: string;
  frameSize: 'S' | 'M' | 'L';
  accessories: {
    fenders: boolean;
    rack: boolean;
    light: boolean;
  };
}

export interface EamesHotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  shortDesc: string;
  detailedDesc: string;
}
