const React = require('react')
    , ReactDOM = require('react-dom')
    , resch = require('resch')
    , schema = require('./schema')
    , data = require('./data')
    , update = require('immutability-helper')

    , reGenArray = require('./table-array')
    , reGenObject = require('./table-object')
    , reGenCell = require('./table-cell')
    , reGenArrayMap = require('./array-map')
    ;

const $ = React.createElement;
const desc = Object.assign({}, resch);
desc.object = reGenArrayMap;
// desc.object = reGenObject;
// desc.array = reGenArray;
// desc.number = reGenCell;
// desc.string = reGenCell;

const cs = {
    type: 'object',
    properties: {}
};

const genForm = resch.__form(React)(desc);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };

        this.updateState = this.updateState.bind(this);

        this.Form = genForm({
            schema: cs,
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

const cd = {
    yAxis: [ {name: 'Snoop'}, {name: 'Snoop Filter'}, {name: 'Snoop Test'}],
    xAxis: [ {name: 'Agent'}, {name: 'Agent Smith'}, {name: 'Agent Test'}],
    data: {

    }
};

ReactDOM.render(
    $(App, { data: cd }),
    document.getElementById('root')
);
