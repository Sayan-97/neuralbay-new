export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Purchase = IDL.Record({
    'timestamp' : Time,
    'buyer' : IDL.Principal,
    'modelId' : IDL.Text,
  });
  return IDL.Service({
    'countPurchases' : IDL.Func([], [IDL.Nat], ['query']),
    'getAllPurchases' : IDL.Func([], [IDL.Vec(Purchase)], ['query']),
    'getPurchasesByUser' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Purchase)],
        ['query'],
      ),
    'hasUserPurchasedModel' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [IDL.Bool],
        ['query'],
      ),
    'recordPurchase' : IDL.Func([IDL.Principal, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
