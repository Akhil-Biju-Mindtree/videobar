export const GPI_RADIO_BUTTON = [
  {
    text: 'High',
    value: '1',
  },
  { text: 'Low', value: '0' },
];

export const TIMZONE_DROPDOWN = [
  {
    label: 'Select Timezone',
    value: '',
  },
];

export const DIALOG_TEXTS = {
  RESTORE_DEFAULT_DIALOG_HEADER: 'Restore Factory Defaults?',
  RESTORE_DEFAULT_DIALOG_CONTENT:
    '<p>Restoring the factory defaults will override the all current device settings.</p><p>Are you sure you want to proceed?</p>',
  RESTORE_DEFAULT_CONFIRM_TEXT: 'Restore',
  DEFAULT_RESTORED: 'Factory defaults restored.',
  RESTART_DEVICE_DIALOG_HEADER: 'Restart Device?',
  RESTART_DEVICE_DIALOG_CONTENT:
    '<p>Restarting device will return the application to the Home screen.</p><p>Are you sure you want to proceed?</p>',
  RESTART_DEVICE_CONFIRM_TEXT: 'Restart',
  CHANGE_PASSWORD_HEADER: 'Change Device Password',
  CHANGE_PASSWORD_CONFIRM_TEXT: 'Save',
  CHANGE_PASSWORD_CANCEL_TEXT: 'Cancel',
  CHANGED_PASSWORD_MESSAGE: 'Password changed successfully.',
  ERROR_DIALOG_HEADER_LOGS_DOWNLOAD: 'Error downloading logs',
  ERROR_DIALOG_CONTENT_LOGS_DOWNLOAD_FAILURE: '<p>There was a problem downloading logs. Please try again.</p>',
  TIMEOUT_DIALOG_CONTENT_LOGS_DOWNLOAD_FAILURE: '<p>Downloading logs timed out. Please try again.</p>',
  LOGS_DOWNLOADED: 'Logs downloaded successfully.',
  LOGS_HEADER: 'Download Logs',
  LOGS_CONFIRM_DIALOG_CONTENT:
    '<p>Downloading logs will reboot the device, log out of the administrative app and return to the Home screen.</p>' +
    '<p>Are you sure you want to proceed?</p>',
};

export const FACTORY_RESTORE_UUIDS = {};

export const TIME_ZONE_LIST = [
  {
    label: '(GMT-10:00) Hawaiian Standard Time',
    value: 'Pacific/Honolulu',
  },
  {
    label: '(GMT-09:30) Marquesas Standard Time',
    value: 'Pacific/Marquesas',
  },
  {
    label: '(GMT-09:00) Alaskan Standard Time',
    value: 'America/Anchorage',
  },
  {
    label: '(GMT-09:00) Aleutian Standard Time',
    value: 'America/Adak',
  },
  {
    label: '(GMT-07:00) Mountain Standard Time (Mexico)',
    value: 'America/Chihuahua',
  },
  {
    label: '(GMT-07:00) Pacific Standard Time',
    value: 'America/Los_Angeles',
  },
  {
    label: '(GMT-07:00) Pacific Standard Time (Mexico)',
    value: 'America/Tijuana',
  },
  {
    label: '(GMT-07:00) US Mountain Standard Time',
    value: 'America/Phoenix',
  },
  {
    label: '(GMT-06:00) Canada Central Standard Time',
    value: 'America/Regina',
  },
  {
    label: '(GMT-06:00) Central America Standard Time',
    value: 'America/Guatemala',
  },
  {
    label: '(GMT-06:00) Central Standard Time (Mexico)',
    value: 'America/Mexico_City',
  },
  {
    label: '(GMT-06:00) Easter Island Standard Time',
    value: 'Pacific/Easter',
  },
  {
    label: '(GMT-06:00) Mountain Standard Time',
    value: 'America/Denver',
  },
  {
    label: '(GMT-05:00) Central Standard Time',
    value: 'America/Chicago',
  },
  {
    label: '(GMT-05:00) Eastern Standard Time (Mexico)',
    value: 'America/Cancun',
  },
  {
    label: '(GMT-05:00) SA Pacific Standard Time',
    value: 'America/Bogota',
  },
  {
    label: '(GMT-04:00) Cuba Standard Time',
    value: 'America/Havana',
  },
  {
    label: '(GMT-04:00) Eastern Standard Time',
    value: 'America/New_York',
  },
  {
    label: '(GMT-04:00) Haiti Standard Time',
    value: 'America/Port-au-Prince',
  },
  {
    label: '(GMT-04:00) Norfolk Standard Time',
    value: 'Pacific/Norfolk',
  },
  {
    label: '(GMT-04:00) SA Western Standard Time',
    value: 'America/La_Paz',
  },
  {
    label: '(GMT-04:00) Turks And Caicos Standard Time',
    value: 'America/Grand_Turk',
  },
  {
    label: '(GMT-04:00) US Eastern Standard Time',
    value: 'America/Indiana/Indianapolis',
  },
  {
    label: '(GMT-04:00) Venezuela Standard Time',
    value: 'America/Caracas',
  },
  {
    label: '(GMT-03:00) Argentina Standard Time',
    value: 'America/Argentina/Buenos_Aires',
  },
  {
    label: '(GMT-03:00) Atlantic Standard Time',
    value: 'America/Halifax',
  },
  {
    label: '(GMT-03:00) Bahia Standard Time',
    value: 'America/Bahia',
  },
  {
    label: '(GMT-03:00) Central Brazilian Standard Time',
    value: 'America/Cuiaba',
  },
  {
    label: '(GMT-03:00) E. South America Standard Time',
    value: 'America/Sao_Paulo',
  },
  {
    label: '(GMT-03:00) Greenland Standard Time',
    value: 'America/Godthab',
  },
  {
    label: '(GMT-03:00) Magallanes Standard Time',
    value: 'America/Punta_Arenas',
  },
  {
    label: '(GMT-03:00) Montevideo Standard Time',
    value: 'America/Montevideo',
  },
  {
    label: '(GMT-03:00) Pacific SA Standard Time',
    value: 'America/Santiago',
  },
  {
    label: '(GMT-03:00) Paraguay Standard Time',
    value: 'America/Asuncion',
  },
  {
    label: '(GMT-03:00) SA Eastern Standard Time',
    value: 'America/Cayenne',
  },
  {
    label: '(GMT-02:30) Newfoundland Standard Time',
    value: 'America/St_Johns',
  },
  {
    label: '(GMT-02:00) Saint Pierre Standard Time',
    value: 'America/Miquelon',
  },
  {
    label: '(GMT-01:00) Azores Standard Time',
    value: 'Atlantic/Azores',
  },
  {
    label: '(GMT-01:00) Cape Verde Standard Time',
    value: 'Atlantic/Cape_Verde',
  },
  {
    label: '(GMT) GMT Standard Time',
    value: 'Europe/London',
  },
  {
    label: '(GMT) Greenwich Standard Time',
    value: 'Atlantic/Reykjavik',
  },
  {
    label: '(GMT) Sao Tome Standard Time',
    value: 'Africa/Sao_Tome',
  },
  {
    label: '(GMT) UTC',
    value: 'UTC',
  },
  {
    label: '(GMT+01:00) Central Europe Standard Time',
    value: 'Europe/Budapest',
  },
  {
    label: '(GMT+01:00) Central European Standard Time',
    value: 'Europe/Warsaw',
  },
  {
    label: '(GMT+01:00) Morocco Standard Time',
    value: 'Africa/Casablanca',
  },
  {
    label: '(GMT+01:00) Romance Standard Time',
    value: 'Europe/Paris',
  },
  {
    label: '(GMT+01:00) W. Central Africa Standard Time',
    value: 'Africa/Lagos',
  },
  {
    label: '(GMT+01:00) W. Europe Standard Time',
    value: 'Europe/Berlin',
  },
  {
    label: '(GMT+02:00) E. Europe Standard Time',
    value: 'Europe/Chisinau',
  },
  {
    label: '(GMT+02:00) Egypt Standard Time',
    value: 'Africa/Cairo',
  },
  {
    label: '(GMT+02:00) FLE Standard Time',
    value: 'Europe/Kiev',
  },
  {
    label: '(GMT+02:00) GTB Standard Time',
    value: 'Europe/Bucharest',
  },
  {
    label: '(GMT+02:00) Israel Standard Time',
    value: 'Asia/Jerusalem',
  },
  {
    label: '(GMT+02:00) Jordan Standard Time',
    value: 'Asia/Amman',
  },
  {
    label: '(GMT+02:00) Kaliningrad Standard Time',
    value: 'Europe/Kaliningrad',
  },
  {
    label: '(GMT+02:00) Libya Standard Time',
    value: 'Africa/Tripoli',
  },
  {
    label: '(GMT+02:00) Middle East Standard Time',
    value: 'Asia/Beirut',
  },
  {
    label: '(GMT+02:00) Namibia Standard Time',
    value: 'Africa/Windhoek',
  },
  {
    label: '(GMT+02:00) South Africa Standard Time',
    value: 'Africa/Johannesburg',
  },
  {
    label: '(GMT+02:00) Sudan Standard Time',
    value: 'Africa/Khartoum',
  },
  {
    label: '(GMT+02:00) Syria Standard Time',
    value: 'Asia/Damascus',
  },
  {
    label: '(GMT+02:00) West Bank Standard Time',
    value: 'Asia/Hebron',
  },
  {
    label: '(GMT+03:00) Arab Standard Time',
    value: 'Asia/Riyadh',
  },
  {
    label: '(GMT+03:00) Arabic Standard Time',
    value: 'Asia/Baghdad',
  },
  {
    label: '(GMT+03:00) Belarus Standard Time',
    value: 'Europe/Minsk',
  },
  {
    label: '(GMT+03:00) E. Africa Standard Time',
    value: 'Africa/Nairobi',
  },
  {
    label: '(GMT+03:00) Russian Standard Time',
    value: 'Europe/Moscow',
  },
  {
    label: '(GMT+03:00) Turkey Standard Time',
    value: 'Europe/Istanbul',
  },
  {
    label: '(GMT+03:30) Iran Standard Time',
    value: 'Asia/Tehran',
  },
  {
    label: '(GMT+04:00) Arabian Standard Time',
    value: 'Asia/Dubai',
  },
  {
    label: '(GMT+04:00) Astrakhan Standard Time',
    value: 'Europe/Astrakhan',
  },
  {
    label: '(GMT+04:00) Azerbaijan Standard Time',
    value: 'Asia/Baku',
  },
  {
    label: '(GMT+04:00) Caucasus Standard Time',
    value: 'Asia/Yerevan',
  },
  {
    label: '(GMT+04:00) Georgian Standard Time',
    value: 'Asia/Tbilisi',
  },
  {
    label: '(GMT+04:00) Mauritius Standard Time',
    value: 'Indian/Mauritius',
  },
  {
    label: '(GMT+04:00) Russia Time Zone 3',
    value: 'Europe/Samara',
  },
  {
    label: '(GMT+04:00) Saratov Standard Time',
    value: 'Europe/Saratov',
  },
  {
    label: '(GMT+04:30) Afghanistan Standard Time',
    value: 'Asia/Kabul',
  },
  {
    label: '(GMT+05:00) Ekaterinburg Standard Time',
    value: 'Asia/Yekaterinburg',
  },
  {
    label: '(GMT+05:00) Pakistan Standard Time',
    value: 'Asia/Karachi',
  },
  {
    label: '(GMT+05:00) West Asia Standard Time',
    value: 'Asia/Tashkent',
  },
  {
    label: '(GMT+05:30) India Standard Time',
    value: 'Asia/Kolkata',
  },
  {
    label: '(GMT+05:30) Sri Lanka Standard Time',
    value: 'Asia/Colombo',
  },
  {
    label: '(GMT+05:45) Nepal Standard Time',
    value: 'Asia/Kathmandu',
  },
  {
    label: '(GMT+06:00) Bangladesh Standard Time',
    value: 'Asia/Dhaka',
  },
  {
    label: '(GMT+06:00) Central Asia Standard Time',
    value: 'Asia/Almaty',
  },
  {
    label: '(GMT+06:00) Omsk Standard Time',
    value: 'Asia/Omsk',
  },
  {
    label: '(GMT+06:30) Myanmar Standard Time',
    value: 'Asia/Yangon',
  },
  {
    label: '(GMT+07:00) Altai Standard Time',
    value: 'Asia/Barnaul',
  },
  {
    label: '(GMT+07:00) N. Central Asia Standard Time',
    value: 'Asia/Novosibirsk',
  },
  {
    label: '(GMT+07:00) North Asia Standard Time',
    value: 'Asia/Krasnoyarsk',
  },
  {
    label: '(GMT+07:00) SE Asia Standard Time',
    value: 'Asia/Bangkok',
  },
  {
    label: '(GMT+07:00) Tomsk Standard Time',
    value: 'Asia/Tomsk',
  },
  {
    label: '(GMT+07:00) W. Mongolia Standard Time',
    value: 'Asia/Hovd',
  },
  {
    label: '(GMT+08:00) China Standard Time',
    value: 'Asia/Shanghai',
  },
  {
    label: '(GMT+08:00) North Asia East Standard Time',
    value: 'Asia/Irkutsk',
  },
  {
    label: '(GMT+08:00) Singapore Standard Time',
    value: 'Asia/Singapore',
  },
  {
    label: '(GMT+08:00) Taipei Standard Time',
    value: 'Asia/Taipei',
  },
  {
    label: '(GMT+08:00) Ulaanbaatar Standard Time',
    value: 'Asia/Ulaanbaatar',
  },
  {
    label: '(GMT+08:00) W. Australia Standard Time',
    value: 'Australia/Perth',
  },
  {
    label: '(GMT+08:45) Aus Central W. Standard Time',
    value: 'Australia/Eucla',
  },
  {
    label: '(GMT+09:00) Korea Standard Time',
    value: 'Asia/Seoul',
  },
  {
    label: '(GMT+09:00) North Korea Standard Time',
    value: 'Asia/Pyongyang',
  },
  {
    label: '(GMT+09:00) Tokyo Standard Time',
    value: 'Asia/Tokyo',
  },
  {
    label: '(GMT+09:00) Transbaikal Standard Time',
    value: 'Asia/Chita',
  },
  {
    label: '(GMT+09:00) Yakutsk Standard Time',
    value: 'Asia/Yakutsk',
  },
  {
    label: '(GMT+09:30) AUS Central Standard Time',
    value: 'Australia/Darwin',
  },
  {
    label: '(GMT+10:00) AUS Eastern Standard Time',
    value: 'Australia/Sydney',
  },
  {
    label: '(GMT+10:00) E. Australia Standard Time',
    value: 'Australia/Brisbane',
  },
  {
    label: '(GMT+10:00) Vladivostok Standard Time',
    value: 'Asia/Vladivostok',
  },
  {
    label: '(GMT+10:00) West Pacific Standard Time',
    value: 'Pacific/Port_Moresby',
  },
  {
    label: '(GMT+10:30) Cen. Australia Standard Time',
    value: 'Australia/Adelaide',
  },
  {
    label: '(GMT+11:00) Bougainville Standard Time',
    value: 'Pacific/Bougainville',
  },
  {
    label: '(GMT+11:00) Central Pacific Standard Time',
    value: 'Pacific/Guadalcanal',
  },
  {
    label: '(GMT+11:00) Lord Howe Standard Time',
    value: 'Australia/Lord_Howe',
  },
  {
    label: '(GMT+11:00) Magadan Standard Time',
    value: 'Asia/Magadan',
  },
  {
    label: '(GMT+11:00) Russia Time Zone 10',
    value: 'Asia/Srednekolymsk',
  },
  {
    label: '(GMT+11:00) Sakhalin Standard Time',
    value: 'Asia/Sakhalin',
  },
  {
    label: '(GMT+11:00) Tasmania Standard Time',
    value: 'Australia/Hobart',
  },
  {
    label: '(GMT+12:00) Fiji Standard Time',
    value: 'Pacific/Fiji',
  },
  {
    label: '(GMT+12:00) Russia Time Zone 11',
    value: 'Asia/Kamchatka',
  },
  {
    label: '(GMT+13:00) New Zealand Standard Time',
    value: 'Pacific/Auckland',
  },
  {
    label: '(GMT+13:00) Tonga Standard Time',
    value: 'Pacific/Tongatapu',
  },
  {
    label: '(GMT+13:45) Chatham Islands Standard Time',
    value: 'Pacific/Chatham',
  },
  {
    label: '(GMT+14:00) Line Islands Standard Time',
    value: 'Pacific/Kiritimati',
  },
  {
    label: '(GMT+14:00) Samoa Standard Time',
    value: 'Pacific/Apia',
  },
];
export const NO_CHANGE_EVENT = 'e001';
export const PROFILE_CANONICAL_NAME = '2C';
export const DOWNLOAD_LOG_UUID = 'a57c3bdf-c765-4bfc-9b83-35d61b40d314';
export const DOWNLOAD_LOG_STATUS_COMPLETE = '100';
export const DOWNLOAD_LOG_STATUS_UUID = '186971a3-e08d-49ad-b02c-00e0b6edae9d';
export const DOWNLOAD_LOGS_STATUS = {
  COPY: 'copying',
  CONVERT: 'converting',
  NONE: 'none',
  WAIT: 'waiting',
};
export const DEVICE_LOGS_ENDPOINT = '/getDeviceLogs';
export const LOGS_WAIT_TIME = 15;
export const DOWNLOAD_LOGS_TITLE = 'Downloading logs';
