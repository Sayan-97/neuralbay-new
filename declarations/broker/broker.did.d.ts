import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Model {
  'wallet_principal_id' : Principal,
  'name' : string,
  'size_bytes' : bigint,
  'description' : string,
  'created_at' : bigint,
  'apiEndpoint' : string,
  'category' : string,
  'uploader' : Principal,
  'image' : string,
  'price' : string,
}
export interface _SERVICE {
  'confirmPayment' : ActorMethod<[bigint], string>,
  'deleteModel' : ActorMethod<[bigint, bigint], string>,
  'getAllConfirmedPayments' : ActorMethod<[], Array<[Principal, bigint]>>,
  'getBrokerCycleBalance' : ActorMethod<[], bigint>,
  'getModelsByUploaderFromStorage' : ActorMethod<[Principal], Array<Model>>,
  'hasPayment' : ActorMethod<[Principal], boolean>,
  'storeModel' : ActorMethod<
    [string, string, string, string, string, string, string, bigint, string],
    string
  >,
  'updateModel' : ActorMethod<
    [bigint, bigint, string, string, string, string, string, string],
    string
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
