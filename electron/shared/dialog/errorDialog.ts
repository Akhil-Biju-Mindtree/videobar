import { dialog } from 'electron';

const errorDialog = (title, content) => {
  dialog.showErrorBox(title, content);
};

export default errorDialog;
