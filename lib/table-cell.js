'use strict';

const tspan = require('tspan');
const font = require('./fonts').Roboto();
const fp = font(16);

const rules = (key) => {
    // Allow: backspace, delete, tab, escape, enter and .
    if (key.match(/[A-Za-z0-9]/))
        return true;
    return false;
};

module.exports = React => {
    const reparse = tspan.reparse(React);
    const $ = React.createElement;

    return () => config => {
        const desc = config.desc.props
            , width = config.width
            , path = config.path
            ;

        const obj = {};
        obj.path = path;
        obj.rules = rules;

        return class Cell extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    caret: undefined,
                    index: undefined
                };
            }

            handleClick (event) {
                const e = event.target;
                const dim = e.getBoundingClientRect();
                let ex = event.clientX - dim.left - 5;
                const arr = String(this.props.data).split('').reduce( (acc, e) => {
                    return acc.concat(acc[acc.length - 1] + fp.getWidth(e));
                }, [0]);
                let index;
                ex = ex < 0 ? 0 : ex;
                for (let i = 1; i < arr.length; i+= 1) {
                    if (arr[i - 1] >= ex && ex <= arr[i]) {
                        if ((arr[i] + arr[i - 1])/2 > ex) {
                            ex = arr[i - 1];
                            index = i - 1;
                        }
                        else {
                            ex = arr[i];
                            index = i;
                        }
                        break;
                    }
                }
                if (ex > arr[arr.length - 1]) {
                    ex = arr[arr.length - 1];
                    index = arr.length;
                }

                obj.box = { x: this.props.index, y: desc.y, w: width, h: desc.height};
                obj.caret = { position: ex + 5, index: index };
                obj.rules = rules;
                obj.data = String(this.props.data);
                config.updateState({ focus: {$set: config.path.concat([obj])}});
            }

            render () {
                const data = this.props.data
                    ;
                return (
                    $('g',
                        {
                            className: config.schema.type === 'string'
                                ? 'col col-data col-header'
                                : 'col col-data',
                            transform: 'translate('+ [0, desc.dy].join(',') + ')',
                            onClick: (e) => this.handleClick(e)
                        },
                        $('rect', {
                            x: 1,
                            y: 1,
                            width: width - 2,
                            height : desc.height - 2,
                            style: { fill: '#ffffff', stroke: 'none'}}),
                        $('path', {
                            className: 'line',
                            d: [ 'm', 0, desc.height, 'v', -desc.height, 'h', width + 2].join(' ') }),
                        $('text', {
                            className: 'text-label',
                            x: 5,
                            y: desc.height * .65 + 1,
                            style: {
                                fill: 'black'
                            }
                        }, reparse(String(data)))
                    )
                );
            }
        };
    };
};
