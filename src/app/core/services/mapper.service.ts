import { Injectable } from '@angular/core';
import * as uiMapperJsonMap from '@assets/json/ui-mapper.json';
import { UIMapperModel } from '@shared/models/ui-mapper.model';
import { Logger } from '@core/logger/Logger';
import * as _ from 'lodash';
import { AppConstants } from '@core/constants/app.constant';

@Injectable({
  providedIn: 'root',
})
export class MapperService {
  nonAdminSettingList = [];
  uiMapperJson = uiMapperJsonMap['default'];
  constructor(private loggerService: Logger) {}

  // !Converts Array of Objects to Objects of Object format
  convertArrayOfObjectsToObjectsOfObjects(arrayToTransfrom): {} {
    const arrayToObject = (array, keyField) =>
      array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
      },           {});
    return arrayToObject(arrayToTransfrom, 'uuid'); // returned value is ObjectsOfObjects
  }

  fetchingSettingsFromJsonUIMapper(formObject): UIMapperModel[] {
    const requiredArray = [];

    // ** Fetch the canonicalName, from the JSON.
    // Iterating over object which has uuid as key and payload as Value
    Object.keys(formObject).forEach((propertyKey: string) => {
      requiredArray.push(
        this.uiMapperJson
          .filter((element: any) => {
            return element.uuid === propertyKey;
          }) // Mapping payload data to the objects of array.
          .map((filteredElement: any) => {
            const propertyValue = formObject[propertyKey];
            return { ...filteredElement, payload: propertyValue };
          })[0], // Since using filter instead of find, so taking first elment of array
      );
    });

    return requiredArray;
  }

  // !Logic to generate dynamic  payload for deviceData (Group)
  generateDynamicPayloadForDeviceData(array) {
    const outerPayload = {};

    // * GroupBy : 'group' property
    const itemsGroupedByGroupPropetry = this.groupElementsByProperty('group');
    const groupedObject = itemsGroupedByGroupPropetry(array);

    // !Iterating over an object, where key is 'group' property
    // * add the property and value (canconical_name & payload) in the group property
    for (const key in groupedObject) {
      if (groupedObject.hasOwnProperty(key)) {
        const innerPayload = {};
        const innerArray = groupedObject[key]; // !Each element of group property is an array
        innerArray.forEach((innerElement: any) => {
          this.generateObjectStructure(innerPayload, innerElement.command_id, innerElement.payload);
        });
        this.generateObjectStructure(outerPayload, key, innerPayload);
      }
    }
    return outerPayload;
  }

  // !Group Array of JavaScript Objects by Key value (property)
  groupElementsByProperty = (key: any) => (array: any) =>
    array.reduce((objectsByKeyValue, obj) => {
      const value = obj[key];
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
    },           {})

  // !Generate new object as per required structurer
  generateObjectStructure(object, property, value) {
    return Object.assign(object, {
      [property]: value,
    });
  }

  // ! Reverse engineering to map uuid with payload
  findUUIDFromCanonicalName(outerObject) {
    const responseItems = [];

    for (const key in outerObject) {
      if (outerObject.hasOwnProperty(key)) {
        const innerObject = outerObject[key];

        for (const prop in innerObject) {
          if (innerObject.hasOwnProperty(prop)) {
            const innerPropertiesValue = innerObject[prop];
            const uuidIdentifier = this.findUUIDForCanonicalName(prop);
            responseItems.push({ [uuidIdentifier]: innerPropertiesValue });
          }
        }
      }
    }
    return responseItems;
  }

  // ! Find uuid for canonical Name
  findUUIDForCanonicalName(canonicalName): string {
    return this.uiMapperJson.find((element: any) => {
      return element.canonical_name === canonicalName;
    }).uuid;
  }

  findCanonicalNameForCommandID(commandID): string {
    return this.uiMapperJson.find((element: any) => {
      return element.command_id === commandID;
    }).canonical_name;
  }

  // !Generating DevicePayload for single data.
  generateDynamicPayloadForSingleDeviceData(payloadData): {} {
    const group = payloadData.group;
    const name = payloadData.canonical_name;
    return {
      [group]: {
        [name]: payloadData.payload,
      },
    };
  }

  findSetting(identifier, payload) {
    const setting = this.uiMapperJson.find((element: UIMapperModel) => {
      return element.uuid === identifier;
    });
    return {
      payload,
      uuid: setting.uuid,
      group: setting.group,
      canonical_name: setting.canonical_name,
      actions: setting.actions,
    };
  }

  findObjectFromJSONMapper(uuidToBeFind): UIMapperModel {
    return this.uiMapperJson.find((element: UIMapperModel) => element.uuid === uuidToBeFind);
  }

  findObjectFromJSONMapperByCommandId(commandIdToBeFind): UIMapperModel {
    return this.uiMapperJson.find((element: UIMapperModel) => element.command_id === commandIdToBeFind);
  }

  // !Fetch All the object which has action as subscribe

  fetchElementsWithSpecificAction = (action: string) => {
    return this.uiMapperJson.filter((element: any) => (this.checkActionsMatched(element, action) ? element : null));
  }

  checkActionsMatched = (element, currentAction) => {
    return element.actions.includes(currentAction) && element.access !== 'private';
  }

  // !In Array, Each Object Should only have 2 property i.e- canonical_name and group
  // TODO : propertyOne: string, propertyTwo: string-> (Generic) -> rest property
  filteredElementsWithProps(action: string, propertyOne: string, propertyTwo: string) {
    return this.fetchElementsWithSpecificAction(action).map((element: UIMapperModel) => {
      return { group: element[propertyOne], canonical_name: element[propertyTwo] };
    });
  }

  // !GroupBy all canonicalName with empty value, It is groupedBy groupName
  groupByGroupName(array) {
    const outerPayload = {};

    const itemsGroupedByGroupPropetry = this.groupElementsByProperty('group');
    const groupedObject = itemsGroupedByGroupPropetry(array);
    for (const key in groupedObject) {
      if (groupedObject.hasOwnProperty(key)) {
        const innerPayload = {};
        const innerArray = groupedObject[key];
        innerArray.forEach((innerElement: any) => {
          this.generateObjectStructure(innerPayload, innerElement.canonical_name, '');
        });
        this.generateObjectStructure(outerPayload, key, innerPayload);
      }
    }
    return outerPayload;
  }

  groupSimilarProperties(action: string, propertyOne: string, propertyTwo: string) {
    const itemsWithSpecificProperty = this.filteredElementsWithProps(action, propertyOne, propertyTwo);
    return this.groupByGroupName(itemsWithSpecificProperty);
  }

  getAllGroupName() {
    const payload = {};
    const nonPrivateGroups = _.filter(
      this.uiMapperJson,
      (item: { access: string }) => item.access !== AppConstants.PRIVATE,
    );
    const allGroupNames = _.map(nonPrivateGroups, 'group');
    const allUniqueGroupNames = _.uniq(allGroupNames);
    for (const key in allUniqueGroupNames) {
      if (allUniqueGroupNames.hasOwnProperty(key)) {
        this.generateObjectStructure(payload, allUniqueGroupNames[key], {});
      }
    }
    return payload;
  }

  // !default value is been fetched from json UI Mapper file
  initialStateFromJSONMapper() {
    const arrayOfKeyValuePairs = this.uiMapperJson.map((uiJsonObject: UIMapperModel) => {
      return {
        [uiJsonObject.canonical_name]: uiJsonObject.default,
      };
    });
    this.loggerService.trace('initialStateFromJSONMapper is finished');
    // !Converting ArrayOfKeyValuePairs to ObjectOfKeyValuePair
    return Object.assign({}, ...arrayOfKeyValuePairs);
  }
  // ! get the list of canonical names which dont need the admin access
  getNonAdminSettingsFromJsonUIMapper() {
    if (this.nonAdminSettingList.length === 0) {
      this.nonAdminSettingList = this.uiMapperJson
        .filter((element: any) => element.access === AppConstants.USER)
        .map((data: any) => data.command_id);
    }
    return this.nonAdminSettingList;
  }
}
