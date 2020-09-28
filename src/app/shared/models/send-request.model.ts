// TODO: Only two properties - action: string, data : [] | string;
export interface SendReqModel {
  action: string;
  data: { [key: string]: any } | 'ALL';
}
