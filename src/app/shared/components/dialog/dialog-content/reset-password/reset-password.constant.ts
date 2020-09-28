export const PASSWORD_CONSTANTS = {
  TEXT: {
    PASSWORD: 'password',
    CONFIRM_PASSWORD: 'confirmPassword',
    NUMBER: 'hasNumber',
    ALPHABET: 'hasAlphabet',
    SPECIALCHAR: 'hasSpeChar',
  },
  ICONS: {
    REGEX_PASS_ICON: 'assets/images/svg/check-mark/checkmark-on.svg',
    REGEX_FAIL_ICON: 'assets/images/svg/check-mark/checkmark-off.svg',
  },
  PASSWORD_MIN_LENGTH: 8,
  NUMBER_REGEX: /[0-9]/,
  ALPHABET_REGEX: /(?=.*[a-z])(?=.*[A-Z])/,
  SPECIALCHARS_REGEX: /[{}?():,;|/<>.@#$%*\s[\]/\\^&+=!_'"`~-]/,
};
