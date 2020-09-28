import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceController } from '../controllers/device.controller';
import { of } from 'rxjs';
import { HIDInstanceSingleton } from '../models/deviceInstance.model';
import * as HID from 'node-hid';
jest.mock('node-hid');
jest.mock('usb');

const deviceController = new DeviceController();

describe('DeviceController test suite', () => {
  it('should create class instance', () => {
    HIDInstanceSingleton.getDeviceHandle = jest.fn().mockImplementation(() => {
      return {
        deviceName: 'Bose-Raphael',
      };
    });
    deviceController.deviceHandle = {
      deviceName: 'Bose-Raphael',
      write: jest.fn().mockImplementation(() => {
        return true;
      }),
    };

    deviceController.deviceHandle.write.mockImplementation(() => {
      return true;
    });

    const payload = {
      action: 'perform',
      password: '21',
      id: '5c0e0230-aa23-11e9-bfeb-e508f5c88124',
      data: {
        camera: {
          'camera.firstPreset': '1 0 0',
        },
      },
    };
    expect(deviceController.deviceHandle.deviceName).toBe('Bose-Raphael');
  });

  it('device handle parameter chunks', () => {
    deviceController.deviceHandle.write([
      4,
      107,
      73,
      106,
      111,
      103,
      73,
      106,
      69,
      53,
      77,
      71,
      86,
      109,
      78,
      87,
      69,
      119,
      76,
      87,
      70,
      107,
      90,
      109,
      85,
      116,
      77,
      84,
      70,
      108,
      79,
      83,
      49,
      104,
      79,
      68,
      90,
      108,
      76,
      87,
      86,
      105,
      78,
      106,
      73,
      49,
      89,
      50,
      90,
      107,
      78,
      84,
      100,
      104,
      79,
      67,
      73,
      115,
      67,
      105,
      65,
      103,
      73,
      110,
      66,
      67,
      68,
    ]);
    expect(
      deviceController.deviceHandle.write([
        4,
        107,
        73,
        106,
        111,
        103,
        73,
        106,
        69,
        53,
        77,
        71,
        86,
        109,
        78,
        87,
        69,
        119,
        76,
        87,
        70,
        107,
        90,
        109,
        85,
        116,
        77,
        84,
        70,
        108,
        79,
        83,
        49,
        104,
        79,
        68,
        90,
        108,
        76,
        87,
        86,
        105,
        78,
        106,
        73,
        49,
        89,
        50,
        90,
        107,
        78,
        84,
        100,
        104,
        79,
        67,
        73,
        115,
        67,
        105,
        65,
        103,
        73,
        110,
        66,
      ]),
    ).toBe(true);
  });
});
