export class ConfirmationDialogModel {
  dialogType ? = 'Confirmation';
  title: string;
  content: string;
  refuteButtonLabel ? = 'Cancel';
  confirmButtonLabel ? = 'Save';
}
