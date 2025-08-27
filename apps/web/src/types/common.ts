export interface BaseResponse<T> {
  statusCode?: number;
  message?: any;
  data: T;
}
