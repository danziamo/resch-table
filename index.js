const React = require('react')
    , ReactDOM = require('react-dom')
    , resch = require('resch')
    , schema = require('./schema')
    , data = require('./data')
    , update = require('immutability-helper')

    , reGenArray = require('./lib/table-array')
    , reGenObject = require('./lib/table-object')
    , reGenCell = require('./lib/table-cell')
    ;

const font = require('./lib/fonts').Roboto();
const fp = font(16);

const $ = React.createElement;
const desc = Object.assign({}, resch);
desc.object = reGenObject;
desc.array = reGenArray;
desc.number = reGenCell;
desc.string = reGenCell;

const genForm = resch.__form(React)(desc);

const getDataByPath = (data, path) => {
    return String(path.reduce( (res, e) => res[e], data));
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            focus: undefined,
        };

        this.updateState = this.updateState.bind(this);

        this.Form = genForm({
            schema: schema,
            path: [],
            updateState: this.updateState
        });
    }

    updateState (spec) {
        this.setState(function (state) {
            return update(state, spec);
        });
    }

    onKeyPress(e) {
        if (this.state.focus) {
            const obj = this.state.focus[this.state.focus.length - 1];
            if (typeof obj === 'object') {
                const str = getDataByPath(this.state.data, obj.path);
                const index = obj.caret.index;
                obj.caret.index = index + 1;
                obj.caret.position += fp.getWidth(e.key);
                const res = str.substring(0, index) + e.key + str.substring(index, str.length);
                const spec = {
                    data: obj.path.reduceRight((p, k) => ({ [k]: p }), {$set: res}),
                    focus: {$set: obj.path.concat([obj])}
                };
                this.updateState(spec)
            }
        }
    }

    render() {
        return (
            $('div', {tabIndex: 0, onKeyPress: (e) => this.onKeyPress(e)},
                $(this.Form , {
                    data: this.state.data,
                    focus: this.state.focus
                })
            )
        );
    }
}

ReactDOM.render(
    $(App, { data: data }),
    document.getElementById('root')
);
