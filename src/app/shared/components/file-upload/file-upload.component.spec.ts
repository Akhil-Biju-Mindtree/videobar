import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxFileDropEntry, FileSystemEntry, FileSystemFileEntry } from 'ngx-file-drop';

describe('FileUploadComponent', () => {
  class DropFileEventMock {
    // tslint:disable-next-line:prefer-array-literal
    files: NgxFileDropEntry[] = new Array<NgxFileDropEntry>();
    constructor() {
      const drop = this.createDrop();
      this.files.push(drop);
    }
    private createDrop(): NgxFileDropEntry {
      const file: FileSystemFileEntry = {
        isFile: true,
        isDirectory: false,
        name: null,
        file: (callback: (filea: File) => void): void => {
          // <-- what does this callback do?
          callback(createFile()); // <-- here I call my own function
        },
      };
      return new NgxFileDropEntry('', file);
    }
    public getFiles() {
      return this.files;
    }
  }

  function createFile(name: string = 'test.dfu', type: string = ''): File {
    const blob = new Blob([''], { type });
    blob['lastModifiedDate'] = null;
    blob['name'] = name;
    return blob as File;
  }

  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    component.closeIcon = '';
    component.fileType = 'dfu';
  });

  afterAll(() => {
    component = null;
  });

  it('should load instance', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngoninit', () => {
    component.ngOnInit();
    component.fileSelected = false;
    component.invalidFileSelected = false;
  });

  it('should call dropped and file size is not less thean max size', () => {
    const $event = new DropFileEventMock();
    component.dropped($event.getFiles());
    expect(component.fileSelected).toEqual(true);
  });

  it('should call dropped and file size is not less thean max size', () => {
    const event = new DropFileEventMock();
    component.dropped(event.getFiles());
    expect(component.fileSelected).toEqual(true);
  });

  it('should call delete method', () => {
    const $event = new DropFileEventMock();
    component.dropped($event.getFiles());
    component.fileApplied = true;
    expect(component.fileSelected).toEqual(false);
  });

  it('should call dropped with fileApplied false', () => {
    const $event = new DropFileEventMock();
    component.dropped($event.getFiles());
    component.fileApplied = false;
    expect(component.fileSelected).toEqual(true);
  });

  it('should call fileOver method ', () => {
    const $event = new DropFileEventMock();
    component.dropped($event.getFiles());
    component.fileOver($event);
    expect(component.fileOver).toBeTruthy();
  });

  it('should call fileleave method ', () => {
    const $event = new DropFileEventMock();
    component.dropped($event.getFiles());
    component.fileLeave($event);
    expect(component.fileLeave).toBeTruthy();
  });
});
