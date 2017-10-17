const React = require('react')
    , $ = React.createElement
    , ReactDOM = require('react-dom')
    , tspan = require('tspan')
    , reparse = tspan.reparse(React)
    , font = require('./indie-flower')()
    , width = require('./width')
    ;

const fontSize = 24;
const fontFamily = 'Indie Flower';
const props = font(fontSize);
const margin = 1;

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    genPath (node) {
        const path = [
            'm', 0, node.height,
            'v', -node.height,
            'h', node.width + 2
        ];
        return path.join(' ');
    }

    genEndPath(node) {
        const path = [
            'm', 0, node.height,
            'h', node.width + 2,
            'v', -node.height
        ];
        return path.join(' ');
    }

    genHeader(node, index) {
        return (
            $('g', { key : index, transform: 'translate('+ [node.dx, node.dy].join(',') + ')' },
                $('path', {d: this.genPath(node), style: {strokeWidth: 1, stroke: 'black', fill: 'none'}}),
                $('text', {
                    x: 1,
                    y: node.height * .65 + 1,
                    style: {
                        fill: 'blue',
                        fontFamily: fontFamily,
                        fontSize: fontSize
                    }
                }, reparse(node.label)),
                node.kind === 'g' && node.body.map( (e, i) => this.genHeader(e, i))
            )
        );
    }

    render() {
        const descriptor = {
            kind: 'g',
            body: [
                { kind: 'col', label: 'Alpha', width: 5 },
                { kind: 'col', label: 'Beta',  width: 7 },
                {
                    kind: 'g',
                    label: 'Nyfi',
                    body: [
                        { kind: 'col', label: 'Uno', width: 12 },
                        { kind: 'col', label: 'Duo', width: 15 }
                    ]
                }
            ]
        };

        const dst = width(descriptor);
        const header = this.genHeader(dst, 0);

        return (
            $('div', {},
                $('svg', {} ,
                    $('g', { transform: 'translate(0.5, 0.5)'},
                        header,
                        $('path', { d: this.genEndPath(dst), style: {strokeWidth: 1, stroke: 'black', fill: 'none'}})
                    )
                )
            )
        );
    }
}

ReactDOM.render(
    $(App, { }),
    document.getElementById('root')
);
