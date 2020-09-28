import { Injectable } from '@angular/core';
import * as uuid from 'uuid/v4';
import { Md5 } from 'ts-md5/dist/md5';
import { ADMIN_CONST } from 'app/admin/admin.constant';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private transactionId = uuid().substring(0, 6);
  constructor() {}

  public generateTransactionId() {
    return this.transactionId;
  }

  public generateMd5Hash(password) {
    return (<string>Md5.hashStr(password)).toUpperCase();
  }
}
