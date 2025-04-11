export const idlFactory = ({ IDL }) => {
  const Model = IDL.Record({
    'wallet_principal_id' : IDL.Principal,
    'name' : IDL.Text,
    'size_bytes' : IDL.Nat,
    'description' : IDL.Text,
    'created_at' : IDL.Nat,
    'apiEndpoint' : IDL.Text,
    'category' : IDL.Text,
    'uploader' : IDL.Principal,
    'image' : IDL.Text,
    'price' : IDL.Text,
  });
  return IDL.Service({
    'confirmPayment' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'deleteModel' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Text], []),
    'getAllConfirmedPayments' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getBrokerCycleBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getModelsByUploaderFromStorage' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Model)],
        [],
      ),
    'hasPayment' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'storeModel' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Text,
        ],
        [IDL.Text],
        [],
      ),
    'updateModel' : IDL.Func(
        [
          IDL.Nat,
          IDL.Nat,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
        ],
        [IDL.Text],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
