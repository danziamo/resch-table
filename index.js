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

const $ = React.createElement;
const desc = Object.assign({}, resch);
desc.object = reGenObject;
desc.array = reGenArray;
desc.number = reGenCell;
desc.string = reGenCell;

const genForm = resch.__form(React)(desc);

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

    render() {
        return (
            $(this.Form , {
                data: this.state.data,
                focus: this.state.focus
            })
        );
    }
}

ReactDOM.render(
    $(App, { data: data }),
    document.getElementById('root')
);
