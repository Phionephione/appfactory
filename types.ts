export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export interface BuildStep {
  id: number;
  text: string;
  status: 'pending' | 'in-progress' | 'complete';
}

export interface GitHubUser {
  login: string;
}

export type AppFile = {
  [filename: string]: string;
};
