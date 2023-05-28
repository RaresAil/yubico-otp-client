import crypto from 'crypto';

export default class Token {
  private sessionTimestamp = 0;
  private sessionCTR = 0;
  private usageCTR = 0;

  constructor(
    private readonly hexSecretKey: string,
    private readonly privateId: string,
    private readonly publicId: string
  ) {}

  public validateCode(code: string): boolean {
    if (this.publicId !== code.slice(0, 12)) {
      return false;
    }

    const hex = this.toHex(code.slice(12));
    const decipher = crypto.createDecipheriv(
      'aes-128-ecb',
      Buffer.from(this.hexSecretKey, 'hex'),
      null
    );
    decipher.setAutoPadding(false);
    const buffer = Buffer.concat([decipher.update(Buffer.from(hex, 'hex'))]);

    if (!this.verifyChecksum(buffer)) {
      return false;
    }

    if (this.privateId !== buffer.subarray(0, 6).toString('hex')) {
      return false;
    }

    const usageCtr = parseInt(
      Buffer.concat([buffer.subarray(7, 8), buffer.subarray(6, 7)]).toString(
        'hex'
      ),
      16
    );

    if (this.usageCTR > usageCtr && this.usageCTR !== Token.MAX_USE_CTR) {
      return false;
    }

    const sessionCtr = parseInt(buffer.subarray(11, 12).toString('hex'), 16);

    if (sessionCtr >= Token.MAX_SESSION_CTR) {
      return false;
    }

    if (this.usageCTR === usageCtr && this.sessionCTR >= sessionCtr) {
      return false;
    }

    const timestamp = parseInt(
      Buffer.concat([buffer.subarray(10, 11), buffer.subarray(8, 10)]).toString(
        'hex'
      ),
      16
    );

    if (timestamp >= Token.MAX_TIMESTAMP) {
      return false;
    }

    if (this.sessionCTR > 1 && this.sessionTimestamp >= timestamp) {
      return false;
    }

    this.sessionTimestamp = timestamp;
    this.sessionCTR = sessionCtr;
    this.usageCTR = usageCtr;

    return true;
  }

  private toHex(value: string): string {
    return value
      .split('')
      .reduce(
        (acc, char) =>
          acc +
          Token.HEX_ARRAY[Token.MODE_HEX_ARRAY.findIndex((c) => c === char)],
        ''
      );
  }

  private verifyChecksum(buffer: Buffer) {
    let crc = 0x7fff;
    let isNeg = true;
    let i;

    for (let j = 0; j < buffer.length; j++) {
      crc ^= buffer[parseInt(j.toString())] & 0xff;

      for (i = 0; i < 8; i++) {
        if ((crc & 1) === 0) {
          crc >>= 1;
          if (isNeg) {
            isNeg = false;
            crc |= 0x4000;
          }
        } else {
          crc >>= 1;
          if (isNeg) {
            crc ^= 0x4408;
          } else {
            crc ^= 0x0408;
            isNeg = true;
          }
        }
      }
    }

    return (isNeg ? crc | 0x8000 : crc) === 0xf0b8;
  }

  private static readonly MAX_TIMESTAMP = 0xffffff;
  private static readonly MAX_SESSION_CTR = 0xff;
  private static readonly MAX_USE_CTR = 0x7fff;

  private static readonly HEX_ARRAY = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ];

  private static readonly MODE_HEX_ARRAY = [
    'l',
    'n',
    'r',
    't',
    'u',
    'v',
    'c',
    'b',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k'
  ];
}
