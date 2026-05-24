import type { ReactElement } from "react";

export enum ERoute {
  ROOT = "/",
  HOME = "/home"
}

export type TRoute = {
  path: ERoute;
  parentPath?: ERoute;
  Icon?: React.FC | ReactElement;
  Component: React.FC;
};

export type PathParams = { [i: string]: string };
