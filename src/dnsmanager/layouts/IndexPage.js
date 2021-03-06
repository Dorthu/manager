import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { setError } from '~/actions/errors';
import { showModal, hideModal } from '~/actions/modal';
import { dnszones } from '~/api';
import { setSource } from '~/actions/source';
import { renderCreateHelper } from '~/linodes/layouts/IndexPage';

export class IndexPage extends Component {
  constructor() {
    super();
    this.deleteZone = this.deleteZone.bind(this);
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setSource(__filename));
    try {
      await dispatch(dnszones.all());
    } catch (response) {
      dispatch(setError(response));
    }
  }

  deleteZone(zoneId) {
    const { dispatch } = this.props;
    dispatch(showModal('Delete DNS Zone', this.renderModal(zoneId)));
  }

  renderModal(zoneId) {
    const { dispatch } = this.props;
    return (
      <div>
        <p>
          <span className="text-danger">WARNING!</span> This will permanently
          delete this DNS Zone. Confirm below to proceed.
        </p>
        <div className="modal-footer">
          <Link
            className="btn btn-cancel"
            onClick={() => dispatch(hideModal())}
          >Nevermind</Link>
          <button
            className="btn btn-primary"
            onClick={() => {
              dispatch(dnszones.delete(zoneId));
              dispatch(hideModal());
            }}
          >Delete</button>
        </div>
      </div>
    );
  }

  render() {
    const { dnszones } = this.props;

    const renderZones = () => (
      <section>
        <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Name</th>
              <th>Type</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(dnszones.dnszones).map(z => (
              <tr key={z.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>
                  <Link to={`/dnsmanager/${z.id}`}>{z.dnszone}</Link>
                </td>
                <td>{z.type}</td>
                <td className="text-xs-right">
                  <a href="#" onClick={() => this.deleteZone(z.id)}>Delete</a>
                </td>
              </tr>
             ))}
          </tbody>
        </table>
      </section>
    );

    return (
      <div className="container">
        <header className="clearfix">
          <div className="float-xs-left">
            <h1>DNS Manager</h1>
          </div>
          <div className="float-xs-right">
            <Link to="/dnsmanager/create" className="btn btn-primary">Add a zone</Link>
          </div>
        </header>
        {Object.keys(this.props.dnszones.dnszones).length ? renderZones() :
           renderCreateHelper('zones', '/dnsmanager/create', 'Add a zone')}
      </div>
    );
  }
}

IndexPage.propTypes = {
  dispatch: PropTypes.func,
  dnszones: PropTypes.object,
  selected: PropTypes.object,
};


function select(state) {
  return {
    dnszones: state.api.dnszones,
  };
}

export default connect(select)(IndexPage);
