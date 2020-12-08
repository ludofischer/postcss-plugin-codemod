module.exports = function(fileInfo, api) {
  
  const j = api.jscodeshift;
  const pluginCreatorAst = j.functionDeclaration(
    j.identifier('pluginCreator'),
    [j.identifier('opts')],
    j.blockStatement([j.emptyStatement()])
  )
  const f = j(fileInfo.source);
  f.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: {
        name: 'postcss'
      }
    }
  }).replaceWith(pluginCreatorAst);
 
  
  return f.toSource();

}
