import { shellElevenProfile } from "./shell-eleven-profile";
import { shellNineProfile } from "./shell-nine-profile";
import { shellThirteenProfile } from "./shell-thirteen-profile";
import { shellTwelveProfile } from "./shell-twelve-profile";

export const extendedShellProfiles = {
  "application-shell-9": shellNineProfile,
  "application-shell-11": shellElevenProfile,
  "application-shell-12": shellTwelveProfile,
  "application-shell-13": shellThirteenProfile,
} as const;
