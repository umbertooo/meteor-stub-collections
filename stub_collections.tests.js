/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback, no-unused-expressions */

import { Meteor } from 'meteor/meteor';
import { expect } from 'meteor/practicalmeteor:chai';
import StubCollections from './stub_collections.js';
import './widgets.js';

if (Meteor.isServer) {
  widgets.remove({});
  widgets.insert({});
  Meteor.publish('widgets', function allWidgets() {
    return widgets.find();
  });
} else {
  Meteor.subscribe('widgets');
}

describe('StubCollections', function () {
  it('should stub added/registered collections', function () {
    expect(widgets.find().count()).to.equal(1);

    StubCollections.add([widgets]);
    StubCollections.stub();
    expect(widgets.find().count()).to.equal(0);

    widgets.insert({});
    widgets.insert({});
    expect(widgets.find().count()).to.equal(2);

    StubCollections.restore();
    expect(widgets.find().count()).to.equal(1);
  });

  it('should stub non-registered one-off collections', function () {
    expect(widgets.find().count()).to.equal(1);

    StubCollections.stub([widgets]);
    expect(widgets.find().count()).to.equal(0);

    widgets.insert({});
    widgets.insert({});
    expect(widgets.find().count()).to.equal(2);

    StubCollections.restore();
    expect(widgets.find().count()).to.equal(1);
  });

  it('should stub the schema of a collection', function () {
    expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey');
    StubCollections.stub([widgets]);
    expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey');
    StubCollections.restore();
    expect(widgets.simpleSchema()._firstLevelSchemaKeys).to.include('schemaKey');
  });
});

const Something = new Mongo.Collection('something');
describe('Issue #1: Uses sandbox', function() {
  before(function() {
    StubCollections.stub(Something);
  });

  after(function() {
    StubCollections.restore();
  });

  it('should pass', function() {
    expect(true).to.equal(true);
  });

  it('should pass with exception', function(){
    expect(function() {
      method_does_not_exist();
    }).to.throw(Error);
  });
});
