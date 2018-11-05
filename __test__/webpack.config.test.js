const webpack_config = require('../webpack.config');

test('test webpack config object', () => {
  console.log(webpack_config);
  expect(3).toBe(3);
});

