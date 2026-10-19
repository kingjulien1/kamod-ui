import { shellElevenProfile } from "./shell-eleven-profile";
import { shellNineProfile } from "./shell-nine-profile";

export const extendedShellProfiles = {
  "application-shell-9": shellNineProfile,
  "application-shell-11": shellElevenProfile,
} as const;
