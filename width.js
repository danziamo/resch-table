'use strict';

const font = require('./roboto')();

module.exports = (fontSize) => {
    const props = font(fontSize);
    var levels = {};

    const lvls = (schema, cur) => {
        if (schema.type === 'object') {
            let tmp = Object.keys(schema.properties).reduce( (acc, e) => {
                return Math.max(acc, lvls(schema.properties[e], cur + 1));
            }, 0);
            tmp += schema.title ? props.getWidth(schema.title) : 0;
            levels[cur] = Math.ceil(Math.max(levels[cur] || 0, tmp));
        } else {
            levels[cur] = Math.ceil(Math.max(levels[cur] || 0, props.getWidth(schema.title)));
        }
        return levels[cur];
    };

    const fill = (schema, x, y, cur, desc) => {
        desc.props = {};
        desc.props.dx = x;
        desc.props.dy = y;
        if (schema.type === 'object') {
            desc.props.width = levels[cur] - levels[cur + 1] || 0;
            var height = Object.keys(schema.properties).reduce( (acc, e) => {
                desc[e] = {};
                return fill(schema.properties[e], levels[cur] - levels[cur + 1] || 0, acc, cur + 1, desc[e]) + acc;
            }, 0);
            desc.props.height = Math.ceil(height);
            return height;
        } else {
            desc.props.height = Math.ceil(props.getHeight());
            desc.props.width = levels[cur];
            return Math.ceil(props.getHeight());
        }
    };

    const getDescriptor = (schema) => {
        lvls(schema, 0);
        const desc = {};
        fill(schema, 0, 0, 0, desc);
        desc.props.width = levels[0];
        return desc;
    };

    return {
        getHeight : props.getHeight,
        getDescent: props.getDescent,
        getDescriptor: getDescriptor
    };
};
