import errorWindow from '../shared/windows/errorWindow';
import { dialog } from 'electron';
describe('Error Window Test', () => {
  test('Error Window  Test', () => {
    errorWindow('title', 'content');
    expect(dialog.showErrorBox).toHaveBeenCalled();
  });
  test('Error Window  Test with parameters', () => {
    jest.spyOn(dialog, 'showErrorBox').mockClear();
    errorWindow('title', 'content');
    expect(dialog.showErrorBox).toHaveBeenCalledWith('title', 'content');
  });
});
