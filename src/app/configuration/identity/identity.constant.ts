import { CONFIGURATION_CONSTANTS } from 'app/configuration/configuration.constant';
export const IDENTITY_FIELDS = [
  { uuid: CONFIGURATION_CONSTANTS.UUID.SYSTEM_NAME, label: 'Device Name', value: '', isRequired: true },
  {
    uuid: CONFIGURATION_CONSTANTS.UUID.SYSTEM_BUILDING,
    label: 'Building (optional)',
    value: '',
  },
  { uuid: CONFIGURATION_CONSTANTS.UUID.SYSTEM_FLOOR, label: 'Floor (optional)', value: '' },
  { uuid: CONFIGURATION_CONSTANTS.UUID.SYSTEM_ROOM, label: 'Room (optional)', value: '' },
];
