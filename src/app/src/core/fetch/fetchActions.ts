
export enum FetchActionTypes {
	FetchRequest = 'Fetch Request',
	FetchSucceed = 'Fetch Succeed',
	FetchFailed = 'Fetch Failed',
	FetchLoading = 'Fetch Loading'
}

export type FetchMethods = 'GET'|'POST'|'PUT'|'DELETE'

export class FetchRequest {
  	type = FetchActionTypes.FetchRequest
	constructor(
		public onSuccess:any,
		public onError:any,
		public onLoading:any,
		public method:FetchMethods,
		public url:string,
		public payload:any = undefined, 
		public postData:any = undefined,
		public getTokenHook:any = undefined
	){}
}
