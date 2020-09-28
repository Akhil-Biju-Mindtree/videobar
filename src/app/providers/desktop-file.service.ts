import { Injectable } from '@angular/core';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';
import { ServiceAdapter } from '@providers/service-adapter';
import { SharedConstants } from '../../../shared/constants/shared.constants';

@Injectable({
  providedIn: 'root',
})
export class DesktopFileService implements FileServiceAdaptor {
  constructor(private serviceAdapter: ServiceAdapter) {}
  send(fileInfo) {
    this.serviceAdapter.ipcRenderer.send(SharedConstants.Channels.FILE_PATH, fileInfo);
  }

  setTransferMode(transferMode) {
    this.serviceAdapter.ipcRenderer.send(SharedConstants.Channels.TRANSFER_MODE, transferMode);
  }
}
