import { IDL } from '@dfinity/candid';

export const idlFactory = ({ IDL }) => {
    const TransferError = IDL.Variant({
      TxTooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
      BadFee: IDL.Record({ expected_fee: IDL.Record({ e8s: IDL.Nat64 }) }),
      TxDuplicate: IDL.Record({ duplicate_of: IDL.Nat64 }),
      TxCreatedInFuture: IDL.Null,
      InsufficientFunds: IDL.Record({ balance: IDL.Record({ e8s: IDL.Nat64 }) }),
    });
  
    const TransferResult = IDL.Variant({
      Ok: IDL.Nat64,
      Err: TransferError,
    });
  
    return IDL.Service({
      send_dfx: IDL.Func(
        [IDL.Record({
          to: IDL.Text,
          fee: IDL.Record({ e8s: IDL.Nat64 }),
          memo: IDL.Nat64,
          from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
          created_at_time: IDL.Opt(IDL.Record({ timestamp_nanos: IDL.Nat64 })),
          amount: IDL.Record({ e8s: IDL.Nat64 }),
        })],
        [IDL.Nat64], // <- 🔥 Only nat64, not variant
        []
      )
      
    });
  };
  