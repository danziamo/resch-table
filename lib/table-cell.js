'use strict';

const tspan = require('tspan');
const font = require('./fonts').Roboto();
const fp = font(16);

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
            onChange = function (value) {
                body.$set = value;
                updateState(spec);
            };
        }



        return class Cell extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    cursor: undefined,
                    index: undefined
                };
            }

            handleClick (event) {
                const e = event.target;
                const dim = e.getBoundingClientRect();
                let x = event.clientX - dim.left - 5;
                const arr = String(this.props.data).split('').reduce( (acc, e) => {
                    return acc.concat(acc[acc.length - 1] + fp.getWidth(e));
                }, [0]);

                let index;
                for (let i = 1; i < arr.length; i+= 1) {
                    if (arr[i - 1] >= x && x <= arr[i]) {
                        if ((arr[i] - arr[i - 1])/2 <= x) {
                            x = arr[i - 1];
                            index = i - 1;
                        }
                        else {
                            x = arr[i];
                            index = i;
                        }
                        break;
                    }
                }

                this.setState ({ cursor: x, index: index });
            }

            onFocus() {
                config.updateState({focus: {$set: config.path.concat([true])}});
            }

            render () {
                const data = this.props.data
                    , focus = this.props.focus
                    ;
                return (
                    $('g',
                        {
                            className: config.schema.type === 'string' ? 'col col-data col-header' : 'col col-data',
                            transform: 'translate('+ [0, desc.dy].join(',') + ')',
                            onClick: (e) => this.onFocus(e)
                        },
                        $('rect', { x: 1, y: 1, width: width - 2, height : desc.height - 2, style: { fill: '#ffffff', stroke: focus ? 'blue' : 'none'}}),
                        // cursor && $('line', { x1: cursor + 5, y1: 2, x2: cursor + 5, y2: desc.height - 2}),
                        $('path', { className: 'line', d: [ 'm', 0, desc.height, 'v', -desc.height, 'h', width + 2].join(' ') }),
                        $('text', {
                            className: 'text-label',
                            x: 5,
                            y: desc.height * .65 + 1,
                            style: {
                                fill: 'blue'
                            }
                        }, reparse(String(data)))
                    )
                );
            }
        };
    };
};
