import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Model {
  'wallet_principal_id' : Principal,
  'name' : string,
  'size_bytes' : bigint,
  'description' : string,
  'created_at' : Time,
  'apiEndpoint' : string,
  'category' : string,
  'uploader' : Principal,
  'image' : string,
  'price' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'addModel' : ActorMethod<
    [string, string, string, string, string, string, string, bigint, string],
    string
  >,
  'deleteModel' : ActorMethod<[bigint], string>,
  'getCycleBalance' : ActorMethod<[], bigint>,
  'getModel' : ActorMethod<[bigint], [] | [Model]>,
  'getModels' : ActorMethod<[], Array<Model>>,
  'getModelsByUploader' : ActorMethod<[Principal], Array<Model>>,
  'getRequiredCycles' : ActorMethod<[bigint], bigint>,
  'updateModel' : ActorMethod<
    [bigint, string, string, string, string, string, string],
    string
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
