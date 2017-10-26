'use strict';

module.exports = React => {
    const $ = React.createElement;
    return genForm => {

        function propReducer (config) {
            const schema = config.schema
                , path = Array.isArray(config.path) ? config.path : []
                ;

            const obj = schema.properties || {};
            const keys = Object.keys(obj);
            return keys.map(key => {
                var val = obj[key];
                return {
                    name: key,
                    type: val.type,
                    fn: genForm({
                        schema: val,
                        desc: config.desc[key],
                        path: path.concat([key]),
                        width: config.width,
                        updateState: config.updateState
                    })
                };
            });
        }

        return config => {
            const children = propReducer(config);
            const desc = config.desc.props;

            return class Obj extends React.Component {

                constructor (props) {
                    super(props);
                }

                shouldComponentUpdate (nextProps) {
                    return !(
                        nextProps.data === this.props.data &&
                        nextProps.focus === this.props.focus
                    );
                }

                render () {
                    const data = this.props.data || {}
                        , index = this.props.index
                        , focus = this.props.focus
                        , isNested = this.props.isNested
                        ;
                    return (
                        $('g',
                            {
                                className: 'group group-data',
                                transform: 'translate('+ [isNested ? 0 : index*config.width, config.desc.props.dy].join(',') + ')'
                            },
                            children.map( (e, i) => $(e.fn, {
                                index: index,
                                isNested: e.type === 'object',
                                key: i,
                                data: data[e.name],
                                focus: (focus && focus.length !== 0 && focus[0] === e.name) ? focus.slice(1, focus.length) : undefined,
                            })),
                            $('path', { className: 'line', d: [ 'm', 0, desc.height, 'v', -desc.height, 'h', config.width + 2].join(' ') })
                        )
                    );
                }
            };
        };
    };
};
