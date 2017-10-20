'use strict';

module.exports = {
    type: 'array',
    title: 'Resource',
    minWidth: 75,
    items: {
        type: 'object',
        properties: {
            name: { type: 'string', title: 'Device' },
            le: { type: 'number', title: 'Logic Elements (LE)' },
            m9k: {
                type: 'object', title: 'M9k Memory', widget: 'column',
                properties: {
                    block: { type: 'number', title: 'Block' },
                    capacity: { type: 'number', title: 'Capacity(KB)' }
                }
            },
            mult: { type: 'number', title: '18 x 18 Multiplier' },
            pll: { type: 'number', title: 'PLL' },
            clock: { type: 'number', title: 'Clock' },
            io: { type: 'number', title: 'Maximum I/O' },
            lvds: { type: 'number', title: 'Maximum LVDS' }
        }
    }
};
