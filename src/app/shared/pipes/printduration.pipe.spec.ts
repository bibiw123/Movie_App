import { PrintdurationPipe } from './printduration.pipe';

describe('PrintdurationPipe', () => {
  it('create an instance', () => {
    const pipe = new PrintdurationPipe();
    expect(pipe).toBeTruthy();
  });
  // test de la méthode transform
  it('should return 1h 30m', () => {
    const pipe = new PrintdurationPipe();
    expect(pipe.transform(90)).toEqual('1h30m');
  });

});
