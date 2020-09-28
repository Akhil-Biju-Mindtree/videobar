'use strict';

module.exports = {
  process(src) {
    return JSON.stringify({default: JSON.parse(src)});
  },
};
