import { Injectable } from '@angular/core';
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
import * as uiMapperJsonMap from '@assets/json/ui-mapper.json';

const SCHEMA = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      uuid: {
        type: ['string'],
        format: 'uuid',
      },
      group: {
        type: ['string'],
      },
      name: {
        type: ['string'],
      },
      actions: {
        type: ['string'],
      },
      canonical_name: {
        type: ['string'],
      },
      data_type: {
        type: ['string'],
      },
      regex_values: {
        type: ['string'],
      },
      default: {
        type: ['string'],
      },
      label: {
        type: ['string'],
      },
    },
    required: ['uuid', 'group', 'name', 'actions', 'canonical_name', 'data_type', 'regex_values', 'default', 'label'],
  },
};

@Injectable({
  providedIn: 'root',
})
export class JsonSchemaValidatorService {
  uiMapperJson = uiMapperJsonMap['default'];
  constructor() {}

  // !Validated the schema for ui-mapper.json file
  isJsonSchemaValid(): boolean {
    const validate = ajv.compile(SCHEMA);
    return validate(this.uiMapperJson);
  }
}
