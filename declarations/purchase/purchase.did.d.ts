import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Purchase {
  'timestamp' : Time,
  'buyer' : Principal,
  'modelId' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'countPurchases' : ActorMethod<[], bigint>,
  'getAllPurchases' : ActorMethod<[], Array<Purchase>>,
  'getPurchasesByUser' : ActorMethod<[Principal], Array<Purchase>>,
  'hasUserPurchasedModel' : ActorMethod<[Principal, string], boolean>,
  'recordPurchase' : ActorMethod<[Principal, string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
