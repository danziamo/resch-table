'use strict';

const font = require('./indie-flower')();

module.exports = (fontSize) => {
    const props = font(fontSize);
    var levels = {};

    const lvl = (node, cur) => {
        if (node.kind === 'g') {
            var tmp = node.body.reduce( (acc, e) => {
                return Math.max(acc, lvl(e, cur + 1));
            }, 0);
            tmp += node.label ? props.getWidth(node.label) : 0;
            levels[cur] = Math.ceil(Math.max(levels[cur] || 0, tmp));
        } else {
            levels[cur] = Math.ceil(Math.max(levels[cur] || 0, props.getWidth(node.label)));
        }
        return levels[cur];
    };

    const back = (node, x, y, cur) => {
        node.dx = x;
        node.dy = y;
        if (node.kind === 'g') {
            node.width = levels[cur] - levels[cur + 1] || 0;
            var height = node.body.reduce( (acc, e) => {
                return back(e, levels[cur] - levels[cur + 1] || 0, acc, cur + 1) + acc;
            }, 0);
            node.height = Math.ceil(height);
            return height;
        } else {
            node.height = Math.ceil(props.getHeight());
            node.width = levels[cur];
            return Math.ceil(props.getHeight());
        }
    };

    return function (node) {
        lvl(node, 0);
        back(node, 0, 0, 0);
        node.width = levels[0];
        console.log(node);
        return node;
    };
};

/* eslint no-console: 0 */
