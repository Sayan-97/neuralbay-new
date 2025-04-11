export const idlFactory = ({ IDL }) => {
  const Time = IDL.Int;
  const Model = IDL.Record({
    'wallet_principal_id' : IDL.Principal,
    'name' : IDL.Text,
    'size_bytes' : IDL.Nat,
    'description' : IDL.Text,
    'created_at' : Time,
    'apiEndpoint' : IDL.Text,
    'category' : IDL.Text,
    'uploader' : IDL.Principal,
    'image' : IDL.Text,
    'price' : IDL.Text,
  });
  return IDL.Service({
    'addModel' : IDL.Func(
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
    'deleteModel' : IDL.Func([IDL.Nat], [IDL.Text], []),
    'getCycleBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getModel' : IDL.Func([IDL.Nat], [IDL.Opt(Model)], ['query']),
    'getModels' : IDL.Func([], [IDL.Vec(Model)], ['query']),
    'getModelsByUploader' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(Model)],
        ['query'],
      ),
    'getRequiredCycles' : IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    'updateModel' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
