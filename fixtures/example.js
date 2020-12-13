import postcss from 'postcss';

export default postcss.plugin('example-plugin', function (opts) {
  if (opts.something) {
  }
  return function (css) {};
});
