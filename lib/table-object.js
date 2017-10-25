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
                        nextProps.focus === undefined &&
                        nextProps.readonly === this.props.readonly
                    );
                }

                render () {
                    const data = this.props.data || {}
                        , index = this.props.index
                        ;
                    return (
                        $('g',
                            {
                                className: 'group group-data',
                                transform: 'translate('+ [index*config.width, config.desc.props.dy].join(',') + ')'
                            },
                            children.map( (e, i) => $(e.fn, {
                                index: e.type === 'object' ? 0 : i,
                                key: i,
                                data: data[e.name]
                            })),
                            $('path', { className: 'line', d: [ 'm', 0, desc.height, 'v', -desc.height, 'h', config.width + 2].join(' ') })
                        )
                    );
                }
            };
        };
    };
};
