import { Observable, Subject } from 'rxjs';

class FileCopyProgressService {
  private copyProgress: Subject<any> = new Subject<any>();
  constructor() {}

  setFileCopyProgress(progress: any) {
    this.copyProgress.next(progress);
  }

  getFileCopyProgress(): Observable<any> {
    return this.copyProgress.asObservable();
  }
}

const FileCopyProgressInstance = new FileCopyProgressService();
export default FileCopyProgressInstance;
