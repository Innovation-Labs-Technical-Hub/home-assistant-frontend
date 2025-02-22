import type { FrontendLocaleData } from "../../data/translation";
import { blankBeforePercent } from "./blank_before_percent";

export const blankBeforeUnit = (
  unit: string,
  localeOptions: FrontendLocaleData | undefined
): string => {
  if (unit === "°") {
    return "";
  }
  if (localeOptions && unit === "%") {
    return blankBeforePercent(localeOptions);
  }
  return " ";
};
