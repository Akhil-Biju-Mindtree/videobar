import { SharedConstants } from '../../shared.constants';
export class FirmwareProgressDialogModel {
  title ? = SharedConstants.TEXT.FIRMWARE_PROGRESS_DIALOG_DEFAULT_TITLE;
  content ? = SharedConstants.TEXT.FIRMWARE_PROGRESS_DIALOG_DEFAULT_CONTENT;
  currentOperationText ? = 'none';
  previousOperation ? = 'none';
}
