import { Subject } from 'rxjs';

export abstract class ServiceAdapter {
  // !Indexable data-types
  abstract requestMap: { [key: string]: Subject<any> };
  abstract ipcRenderer = null;
  abstract webFrame = null;
  abstract remote = null;
  abstract childProcess = null;
  abstract fs = null;
  abstract getDeviceConnectionStatus;
  abstract send(request);
  abstract isElectron();
  abstract releaseResources();
}

// !Indexable types have an index signature that describes the types we can use
// !to index into the object, along with the corresponding return types when indexing.
