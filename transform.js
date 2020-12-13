module.exports = function (fileInfo, api) {
  const j = api.jscodeshift;
  const postCssAssignmentAST = j.assignmentExpression(
    '=',
    j.memberExpression(j.identifier('pluginCreator'), j.identifier('postcss')),
    j.literal('true')
  );
  const f = j(fileInfo.source);
  const oldPluginDefinition = f.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: 'postcss',
      },
      property: {
        name: 'plugin',
      },
    },
  });
  f.find(j.ImportDeclaration, {
    type: 'ImportDeclaration',
    source: {
      type: 'Literal',
      value: 'postcss',
    },
  }).remove();

  const oldReturnStatement = oldPluginDefinition
    .nodes()[0]
        .arguments[1].body.body.filter((node) => node.type === 'ReturnStatement');
  const oldOptionHandling = oldPluginDefinition
    .nodes()[0]
    .arguments[1].body.body.filter((node) => node.type !== 'ReturnStatement');
  const pluginName = oldPluginDefinition.nodes()[0].arguments[0];
  const oldPluginBody = oldPluginDefinition.nodes()[0].arguments[1].body;
  const oldArguments = oldPluginDefinition.nodes()[0].arguments[1].params;
  const pluginCreatorAst = j.functionDeclaration(
    j.identifier('pluginCreator'),
    oldArguments,
    j.blockStatement([
      ...oldOptionHandling,
      j.returnStatement(
        j.objectExpression([
          j.property('init', j.identifier('postcssPlugin'), pluginName),
          j.property(
            'init',
            j.identifier('OnceExit'),
            oldReturnStatement[0].argument
          ),
        ])
      ),
    ])
  );

  oldPluginDefinition.replaceWith(pluginCreatorAst);
  return f.toSource();
};
