import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      ratio: 'float',  // Add the 'ratio' field
      upper_bound: 'float',  // Add the 'upper_bound' field
      lower_bound: 'float',  // Add the 'lower_bound' field
      trigger_alert: 'float',  // Add the 'trigger_alert' field
      price_abc: 'float',  // Add 'price_abc' field
      price_def: 'float',  // Add 'price_def' field
      timestamp: 'date',  // Add the 'timestamp' field
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg',  // Update the aggregate for 'ratio'
        lower_bound: 'last',  // Update the aggregate for 'lower_bound'
        upper_bound: 'last',  // Update the aggregate for 'upper_bound'
        trigger_alert: 'last',  // Update the aggregate for 'trigger_alert'
        price_abc: 'avg',  // Update the aggregate for 'price_abc'
        price_def: 'avg',  // Update the aggregate for 'price_def'
        timestamp: 'distinct count',  // Update the aggregate for 'timestamp'
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      // Update the table with the new data
      this.table.update(
        DataManipulator.generateRow(this.props.data)
      );
    }
  }

  render() {
    return (
      <perspective-viewer />
    );
  }
}

export default Graph;
