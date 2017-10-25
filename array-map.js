'use strict';

const tspan = require('tspan');
const font = require('./fonts').Roboto();
const fontSize = 16;
const margin = 2;
const fp = font(fontSize);

module.exports = React => {
    const reparse = tspan.reparse(React);
    const $ = React.createElement;

    return () => config => {
        const path = config.path
            , updateState = config.updateState;

        let onChange;
        if (typeof updateState === 'function') {
            const body = { $set: '' };
            const spec = { data: path.reduceRight((p, k) => ({ [k]: p }), body) };
            onChange = function (event) {
                body.$set = event.target.value;
                updateState(spec);
            };
        }

        const genSider = (arr, w, h, offset) => {
            return (
                $('g',
                    {
                        transform: 'translate(10,' + (10 + offset) + ')',
                    },
                    arr.map( (e, i) =>
                        $('g',
                            {
                                transform: 'translate(0,' + i * h + ')',
                                key: i
                            },
                            $('path', { className: 'line', d : ['m', 0, h, 'v', -h, 'h', w].join(' ')}),
                            $('text', {
                                x: 1,
                                y: Math.ceil(h-fp.getDescent()) + 1
                            }, reparse(e.name))
                        )
                    )
                )
            );
        };

        const genHeader = (arr, w, h, offset) => {
            return (
                $('g',
                    {
                        transform: 'translate(' + (10+offset) + ', 10)',
                    },
                    arr.map( (e, i) =>
                        $('g',
                            {
                                transform: 'translate(' + i * h + ',0)',
                                key: i
                            },
                            $('path', {className: 'line', d: ['m', 0, w + h, 'l', w, -w, 'h', h].join(' ')}),
                            $('text', {
                                x: 1,
                                y: Math.ceil(h-fp.getDescent()) + 1,
                                transform: 'translate('+[h, w].join(',') + ') rotate(-45)',
                                textAnchor: 'start'
                            }, reparse(e.name))
                        )
                    )
                )
            );
        }

        return function ArrayMap (props)  {
            const data = props.data
                ;

            const yMaxWidth = Math.ceil(data.yAxis.reduce( (m, e) => Math.max(m, fp.getWidth(e.name)), 0));
            const xMaxWidth = Math.ceil(data.xAxis.reduce( (m, e) => Math.max(m, fp.getWidth(e.name)), 0));

            return (
                $('svg',
                    {
                        width: 400,
                        height: 600,
                    } ,
                    $('g', { transform: 'translate(0.5, 0.5)'},
                        genSider(data.yAxis, Math.ceil(yMaxWidth), Math.ceil(fp.getHeight()), xMaxWidth),
                        genHeader(data.xAxis, Math.ceil(0.707*xMaxWidth), Math.ceil(1.3*fp.getHeight()), yMaxWidth),
                        $('g',
                            {
                                className: 'array',
                                transform: 'translate(10, 10)'
                            }
                        )
                    )
                )
            );
        };
    };
};
