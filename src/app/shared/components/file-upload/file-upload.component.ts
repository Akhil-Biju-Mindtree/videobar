import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { SharedConstants } from '@shared/shared.constants';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  closeIcon = SharedConstants.ICON.CLOSE_ICON;
  errorMessage;
  @Input() fileType;
  @Input() actionText;
  @Input() accept;
  @Input() set fileApplied(val: boolean) {
    if (val) {
      this.delete();
    }
  }
  @Output() fileData: EventEmitter<any> = new EventEmitter<any>();
  invalidFileSelected: boolean;
  fileSelected: boolean;
  fileName: string;
  files: NgxFileDropEntry[] = [];
  constructor() {}

  ngOnInit() {
    this.fileSelected = false;
    this.invalidFileSelected = false;
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.fileName = file.name;
          if (this.fileName.substr(-Math.abs(this.fileType.length)) === this.fileType.toLowerCase()) {
            if (file.size < SharedConstants.MAX_FILE_SIZE) {
              this.fileSelected = true;
              this.invalidFileSelected = false;
              this.fileData.emit(file);
            } else {
              this.errorMessage = SharedConstants.FILE_TYPE_TEXT.FILE_ERROR_SIZE_EXCEEDED;
              this.invalidFileSelected = true;
              this.fileSelected = false;
              this.fileData.emit(null);
            }
          } else {
            this.errorMessage = SharedConstants.FILE_TYPE_TEXT.FILE_ERROR_TYPE;
            this.fileSelected = false;
            this.invalidFileSelected = true;
            this.files.pop();
            this.fileData.emit(null);
          }
        });
      }
    }
  }

  fileOver(event) {}

  fileLeave(event) {}

  delete() {
    this.files.pop();
    this.fileSelected = false;
    this.invalidFileSelected = false;
    this.fileData.emit(null);
  }
}
