import Token from '../Token';

const token = new Token(
  '5f510d5fc83b86b86bcbc2273dbaa096',
  '6b3551d26714',
  'vvcccccccccc'
);

describe('Test the Token class', () => {
  it('The validation should pass for first token', () => {
    expect(
      token.validateCode('vvccccccccccgnckketgdtiekccritgfcdfghnrnjjbk')
    ).toBe(true);
  });

  it('The validation should fail for an older code', () => {
    expect(
      token.validateCode('vvccccccccccllnbicittgjhdlrrkelfhjcdhdlfibuj')
    ).toBe(false);
  });

  it('The validation should fail for an already validated code', () => {
    expect(
      token.validateCode('vvccccccccccgnckketgdtiekccritgfcdfghnrnjjbk')
    ).toBe(false);
  });

  it('The validation should pass for a fresh token after re insert', () => {
    expect(
      token.validateCode('vvccccccccccbkkvdhcbikjibdcnkvubvgcicvdgfdkv')
    ).toBe(true);
  });

  it('The validation should fail for invalid public id', () => {
    expect(
      token.validateCode('vvccccvcccccbkkvdhcbikjibdcnkvubvgcicvdgfdkv')
    ).toBe(false);
  });

  it('The validation should fail for invalid checksum', () => {
    expect(
      token.validateCode('vvcccccccccckbkvdhcbikjibdcnkvubvgcicvdgfdkv')
    ).toBe(false);
  });
});
