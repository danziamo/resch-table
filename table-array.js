'use strict';

const getDefaults = require('resch/lib/get-defaults')
    , width = require('./width')
    , tspan = require('tspan')
    ;

const margin = 2;
const fontSize = 16;
const minWidth = 80;
const totalWidth = 800;
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
            console.log(desc);
            let arr = [];

            return {
                get: function (index) {
                    if (arr[index] === undefined) {
                        const selfPath = path.concat([index]);

                        let handleDelete;
                        if (typeof updateState === 'function') {
                            const selfBody = { $splice: [[index, 1]] };
                            const selfSpec = {
                                data: path.reduceRight((prev, key) => ({ [key]: prev }), selfBody),
                                focus: { $set: undefined }
                            };

                            handleDelete = function () {
                                updateState(selfSpec);
                            };
                        }

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
            const schema = config.schema
                , path = config.path
                , updateState = config.updateState;

            let handleAdd = () => {};
            if (typeof updateState === 'function') {
                const focusSpec = { $set: path };
                const itemSpec = [getDefaults(schema.items)];
                const arrayBody = { $push: itemSpec };
                const arraySpec = {
                    data: path.reduceRight((prev, key) => ({ [key]: prev }), arrayBody),
                    focus: focusSpec
                };
                const newBody = { $set: itemSpec };
                const newArraySpec = {
                    data: path.reduceRight((prev, key) => ({ [key]: prev }), newBody),
                    focus: focusSpec
                };
                handleAdd = len => function () {
                    focusSpec.$set = path.concat([len]);
                    if (len === 0) {
                        updateState(newArraySpec);
                    } else {
                        updateState(arraySpec);
                    }
                };
            }

            return class Arr extends React.Component {

                constructor (props) {
                    super(props);
                }

                shouldComponentUpdate (nextProps) {
                    return !(
                        nextProps.data === this.props.data
                    );
                }

                render () {
                    const data = Array.isArray(this.props.data) ? this.props.data : []
                        ;

                    const diff = totalWidth - itemizer.height();
                    const tables = Math.ceil(diff/minWidth);

                    return (
                        $('svg',
                            {
                                width: totalWidth,
                                height: 600,
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
                                        data: e
                                    }))
                                )
                            )
                        )
                    );
                }
            };
        };
    };
};
