export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addModel' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Text], []),
    'getModels' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text, IDL.Text))],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
