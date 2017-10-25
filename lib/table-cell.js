'use strict';

const tspan = require('tspan');

module.exports = React => {
    const reparse = tspan.reparse(React);
    const $ = React.createElement;

    return () => config => {
        const path = config.path
            , desc = config.desc.props
            , width = config.width
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

        return function Cell (props)  {
            const data = props.data
                ;

            return (
                $('g',
                    {
                        className: config.schema.type === 'string' ? 'col col-data col-header' : 'col col-data',
                        transform: 'translate('+ [0, desc.dy].join(',') + ')'
                    },
                    $('path', { className: 'line', d: [ 'm', 0, desc.height, 'v', -desc.height, 'h', width + 2].join(' ') }),
                    $('text', {
                        className: 'text-label',
                        x: 5,
                        y: desc.height * .65 + 1,
                        style: {
                            fill: 'blue'
                        }
                    }, reparse('<b>' + String(data) + '</b>'))
                )
            );
        };
    };
};
