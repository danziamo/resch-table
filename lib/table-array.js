'use strict';

const width = require('./width')
    , tspan = require('tspan')
    ;

const margin = 2;
const fontSize = 16;
const minWidth = 80;
const totalWidth = 900;
const calc = width(fontSize);

const genPath =  (node) => {
    const path = [
        'm', 0, node.height,
        'v', -node.height,
        'h', node.width + 2*margin
    ];
    return path.join(' ');
};

module.exports = React => {
    const $ = React.createElement
        , reparse = tspan.reparse(React)
        ;

    const genHeader = (schema, node, index) => {
        return (
            $('g',
                {
                    className: schema.type === 'object' ? 'group' : 'col',
                    key : index,
                    transform: 'translate('+ [node.props.dx, node.props.dy].join(',') + ')'
                },
                $('path', { className: 'line', d: genPath(node.props) }),
                $('text', {
                    className: 'text-label',
                    x: 1,
                    y: Math.ceil(node.props.height - calc.getDescent() + 1)
                }, reparse(schema.title)),
                schema.type === 'object' && Object.keys(schema.properties).map( (e, i) => genHeader(schema.properties[e], node[e], i))
            )
        );
    };

    return genForm => {

        function genItemizer (config) {
            const schema = config.schema
                , path = Array.isArray(config.path) ? config.path : []
                , updateState = config.updateState;

            const desc = calc.getDescriptor(schema.items);
            let arr = [];

            return {
                get: function (index) {
                    if (arr[index] === undefined) {
                        const selfPath = path.concat([index]);

                        const Form = genForm({
                            schema: schema.items,
                            desc: desc,
                            path: selfPath,
                            width: minWidth,
                            updateState: updateState
                        });

                        arr[index] = function Ari (props) {

                            return $(Form, props);
                        };
                    }
                    return arr[index];
                },
                header: function() {
                    return genHeader(schema.items, desc, 0);
                },
                width: function() {
                    return desc.props.width;
                },
                height: function() {
                    return desc.props.height;
                },
                descent: function() {
                    return calc.getDescent();
                }
            };
        }

        return config => {
            const itemizer = genItemizer(config);

            return class Arr extends React.Component {

                constructor (props) {
                    super(props);
                }

                shouldComponentUpdate (nextProps) {
                    return !(
                        nextProps.data === this.props.data &&
                        nextProps.focus === undefined
                    );
                }

                render () {
                    const data = Array.isArray(this.props.data) ? this.props.data : [],
                        focus = this.props.focus
                        ;

                    // const diff = totalWidth - itemizer.width();
                    // const tables = Math.ceil(diff/minWidth);
                    const box = focus ? focus[focus.length - 1].box : undefined;
                    const caret = focus ? focus[focus.length - 1].caret : undefined;
                    return (
                        $('svg',
                            {
                                width: totalWidth,
                                height: itemizer.height(),
                            } ,
                            $('g', { transform: 'translate(0.5, 0.5)'},
                                itemizer.header(),
                                $('g',
                                    {
                                        className: 'array',
                                        transform: 'translate('+ [itemizer.width(), 0].join(',') + ')'
                                    },
                                    data.map ((e, i) => $(itemizer.get(i), {
                                        index: i,
                                        key: i,
                                        data: e,
                                        focus: (focus && focus.length !== 0 && focus[0] === i)
                                            ? focus.slice(1, focus.length)
                                            : undefined,
                                    })),
                                    box && $('rect', {
                                        className: 'cursor-box',
                                        x: minWidth*box.x,
                                        y: box.y,
                                        width: box.w,
                                        height : box.h
                                    }),
                                    caret && $('line', {
                                        className: 'caret',
                                        x1: minWidth*box.x + caret.position,
                                        y1: box.y + 2,
                                        x2: minWidth*box.x + caret.position,
                                        y2: box.y + box.h - 2
                                    })
                                ),
                                $('path', {
                                    className: 'line',
                                    d: ['m', 0, itemizer.height() - 1,
                                        'h', itemizer.width() + data.length*minWidth + 2,
                                        'v', -itemizer.height()
                                    ]. join(' ')
                                })
                            )
                        )
                    );
                }
            };
        };
    };
};
