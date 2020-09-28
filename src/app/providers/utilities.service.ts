import { Injectable } from '@angular/core';
import { Logger } from '@core/logger/Logger';
import { DeviceError } from './../../../shared/error/error.model';
import { SYSTEM_ERROR_CODES } from '../../../shared/error/error.constants';
import { ProcessJsonResponseService } from './process-json-response.service';

enum RESPONSE_POSITION {
  zero = 4,
  first = 254,
  last = 255,
}
let timer;
@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(private loggerService: Logger, private processJsonResponseService: ProcessJsonResponseService) {}

  /**
   * converting the payload to buffer stream and get the data value.
   */
  converteBufferOctatesStreamToIntegersStream = (buffer: Buffer): [] => {
    const convertToBase64 = buffer.toString('base64');
    const integerData = JSON.parse(JSON.stringify(Buffer.from(convertToBase64)));
    return integerData['data'];
  }
  /**
   * converting the payload to buffer stream and get the data value.
   */

  convertBufferStream = (data: any): number[] => {
    return Object.values(data);
  }
  /**
   * This Function is called from listenFromDevice function to parse the data and collate to form the json string.
   */
  sliceBufferStream = (data: any) => {
    let outputIntegerStream: any = this.convertBufferStream(data);
    if (outputIntegerStream[0] !== RESPONSE_POSITION.zero) {
      const errorModel = new DeviceError();
      errorModel.code = SYSTEM_ERROR_CODES.ERROR11.code;
      errorModel.message = SYSTEM_ERROR_CODES.ERROR7.message;
      this.loggerService.debug(errorModel);
      throw errorModel;
    }
    // remove '04' from the packet
    outputIntegerStream.shift();
    if (outputIntegerStream[0] === RESPONSE_POSITION.first) {
      outputIntegerStream.shift();
      return { outputIntegerStream, packetPosition: 'first' };
    }
    if (outputIntegerStream.includes(RESPONSE_POSITION.last)) {
      outputIntegerStream = outputIntegerStream.slice(0, outputIntegerStream.indexOf(RESPONSE_POSITION.last));
      return { outputIntegerStream, packetPosition: 'last' };
    }
    return { outputIntegerStream, packetPosition: 'middle' };
  }
  /**
   * This Function is called for decoding the accumulated array from base64 to proper json format.
   */
  decodeFromBase64 = (data: any) => {
    const responsebuffer = Buffer.from(data);
    responsebuffer.toString('utf8');
    const finalbuffer = Buffer.from(responsebuffer.toString('utf8'), 'base64');
    if (!this.processJsonResponseService.isJsonString(finalbuffer.toString('ascii'))) {
      this.loggerService.trace('ERROR OCCURRED WHILE PARSING RESPONSE JSON');
    }
    return finalbuffer.toString('ascii');
  }
  /**
   *  Appending and pushing 254 and 255 to the array before writing to the device.
   */
  concateOctateToPerformWriteOperation = (payload): number[] => {
    const integerStreamData: number[] = this.converteBufferOctatesStreamToIntegersStream(Buffer.from(payload));
    integerStreamData.splice(0, 0, RESPONSE_POSITION.first);
    integerStreamData.push(RESPONSE_POSITION.last);
    return [...integerStreamData];
  }
  /**
   * Debounce function - pass function and delay as parameters, function will be exicuted after delay elapased
   */
  debounce(func, delay) {
    clearTimeout(timer);
    timer = setTimeout(() => func.call(), delay);
  }
}
