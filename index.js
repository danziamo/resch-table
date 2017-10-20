const React = require('react')
    , ReactDOM = require('react-dom')
    , resch = require('resch')
    , schema = require('./schema')
    , data = require('./data')
    , update = require('immutability-helper')

    , reGenObjectColumn = require('./object-column')
    , reGenArray = require('./array')
    , reGenColumn = require('./number')
    , reGenObject = require('./object')
    , reGenString = require('./string')
    ;

const $ = React.createElement;
const desc = Object.assign({}, resch);
desc.array = reGenArray;
desc.object = reGenObject;
desc.number = reGenColumn;
desc.string = reGenString;
desc.object_column = reGenObjectColumn;

const genForm = resch.__form(React)(desc);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
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
                data: this.state.data
            })
        );
    }
}

ReactDOM.render(
    $(App, { data: data }),
    document.getElementById('root')
);
