
const { expect } = require('chai');
const utils = require('../src/index.js');
const { mongoose } = utils;

describe('ObjectIds', () => {
  it('should check objectIds', () => {
    const f = utils.isValidObjectId;
    expect(f('1233')).to.be.false;
    expect(f('1234567890abcdef12345678')).to.be.true;
    const id = new mongoose.Types.ObjectId();
    expect(f(id)).to.be.true;
    expect(f(id.valueOf())).to.be.true;
    expect(f(utils.castToObjectId(id))).to.be.true;
  });

  it('should check obejctId instances', () => {
    const f = utils.isValidObjectIdInstance;
    expect(f('1233')).to.be.false;
    expect(f('1234567890abcdef12345678')).to.be.false;
    const id = new mongoose.Types.ObjectId();
    expect(f(id)).to.be.true;
    expect(f(id.toString())).to.be.false;
    expect(f(utils.castToObjectId(id))).to.be.true;
  });
});

describe('Date Time', () => {
  it('should check for valid time', () => {
    const f = utils.isValidTime;
    expect(f('sdfd123343')).to.be.false;
    expect(f(new Date())).to.be.true;
  });
});

describe('Objects and arrays', () => {
  it('should return the values', () => {
    const values = utils.values({
      a: 'val1',
      b: 'val2',
    });
    expect(values).to.deep.equal(['val1', 'val2']);
  });

  it('should return the pairs', () => {
    const pairs = utils.pairs({
      a: 'val1',
      b: 'val2',
    });
    expect(pairs).to.deep.equal([['a', 'val1'], ['b', 'val2']]);
  });

  it('should covert array of object into a map', () => {
    const array = [{
      id: 'one',
      value: 'Cage'
    }, {
      id: 'two',
      value: 'Cage the Elephants'
    }];
    const object = utils.arrayToObject(array, 'id');
    expect(object).to.deep.equal({
      one: {
        id: 'one',
        value: 'Cage'
      },
      two: {
        id: 'two',
        value: 'Cage the Elephants'
      },
    });
  });

  it('should update the object', () => {
    const base = {
      id: 'one',
      value: 'Cage',
    };
    const object = utils.updateObject(base, {
      value: 'Cage the Elephants',
      genre: 'Awesome',
    });
    expect(object).to.deep.equal({
      id: 'one',
      value: 'Cage the Elephants',
      genre: 'Awesome',
    });
  });
});

describe('Parsing things', () => {
  it('safely parse json', function () {
    const f = utils.safeJSON;
    expect(f(['590090620288551000323378'])).to.deep.equal(['590090620288551000323378']);
    expect(f('["590090620288551000323378"]')).to.deep.equal(['590090620288551000323378']);
    expect(f('true')).to.be.true;
    expect(f('null')).to.be.null;
    expect(f(null)).to.be.null;
  });

  
});
