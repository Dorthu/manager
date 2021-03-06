import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { IndexPage } from '~/dnsmanager/layouts/IndexPage';
import { api } from '@/data';
import { SHOW_MODAL } from '~/actions/modal';

const { dnszones } = api;

describe('dnsmanager/layouts/IndexPage', () => {
  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  const dispatch = sandbox.spy();

  it('renders a list of DNS Zones', () => {
    const page = shallow(
      <IndexPage
        dispatch={dispatch}
        selected={{}}
        dnszones={dnszones}
      />
    );

    const table = page.find('table');
    expect(table.length).to.equal(1);
    expect(table.find('tbody tr').length).to.equal(
      Object.keys(dnszones.dnszones).length);
    expect(table.find('tbody tr td').at(1).find('Link')
                .props().to)
      .to.equal('/dnsmanager/1');
    expect(table.find('tbody tr td').at(2)
                .text())
    .to.equal('master');
    expect(table.find('tbody tr td').at(3).find('a')
                .text())
      .to.equal('Delete');
  });

  it('shows the delete modal when delete is pressed', () => {
    const page = shallow(
      <IndexPage
        dispatch={dispatch}
        selected={{}}
        dnszones={dnszones}
      />
    );

    const zoneDelete = page.find('tbody tr a').at(0);
    dispatch.reset();
    zoneDelete.simulate('click');
    expect(dispatch.calledOnce).to.equal(true);
    expect(dispatch.firstCall.args[0])
      .to.have.property('type').which.equals(SHOW_MODAL);
  });
});
