import { Injectable } from '@angular/core';
import { FileServiceAdaptor } from '@providers/file-service-adaptor';

@Injectable({
  providedIn: 'root',
})
export class WebFileService implements FileServiceAdaptor {
  constructor() {}
  send(fileInfo) {}
  setTransferMode(transferMode) {}
}
