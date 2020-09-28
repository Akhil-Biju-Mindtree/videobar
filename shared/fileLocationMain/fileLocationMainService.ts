class FileLocationMainService {
  fileLocation;
  fileTransferMode;
  constructor() {}

  setFileLocation(filePath: string) {
    this.fileLocation = filePath;
  }

  getFileLocation(): string {
    return this.fileLocation;
  }

  setFileTransferMode(mode: string) {
    this.fileTransferMode = mode;
  }

  getFileTransferMode(): string {
    return this.fileTransferMode;
  }
}

const FileLocationMainInstance = new FileLocationMainService();
export default FileLocationMainInstance;
