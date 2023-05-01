import { NextResponse } from 'next/server'
import {
  decode as _fromBase64Url,
  encode as _toBase64Url,
} from 'next-base64';


const encoder = new TextEncoder();
const decoder = new TextDecoder();
export const encode = encoder.encode.bind(encoder);
export const decode = decoder.decode.bind(decoder);

export const byteStringToBuffer = (byteString: string) =>
  Uint8Array.from(byteString, (e) => e.charCodeAt(0)).buffer;

export const bufferToByteString = (buffer: ArrayBuffer) =>
  String.fromCharCode(...new Uint8Array(buffer));

export const toBase64Url = _toBase64Url;
export const fromBase64Url = _fromBase64Url;
export const marshal = (data: object) => toBase64Url(JSON.stringify(data));
export const unmarshal = (data: string) => JSON.parse(fromBase64Url(data));

export const safeEncode = (data: string) => encode(fromBase64Url(data));
export const safeDecode = (data: ArrayBuffer) => toBase64Url(decode(data));
export const safeByteEncode = (data: string) =>
  byteStringToBuffer(fromBase64Url(data));
export const safeByteDecode = (data: ArrayBuffer) =>
  toBase64Url(bufferToByteString(data));

export function concatBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
  let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}

export function isBiggerBuffer(a: ArrayBuffer, b: ArrayBuffer) {
  const dvA = new DataView(a);
  const dvB = new DataView(b);

  if (dvA.byteLength > dvB.byteLength) {
      return true;
  }

  for (let i = 0; i < dvA.byteLength; i++) {
      if (dvA.getUint8(i) > dvB.getUint8(i)) {
          return true;
      }
  }

  return false;
}

export function isEqualBuffer(a: ArrayBuffer, b: ArrayBuffer) {
  const dvA = new DataView(a);
  const dvB = new DataView(b);

  if (dvA.byteLength !== dvB.byteLength) {
      return false;
  }

  for (let i = 0; i < dvA.byteLength; i++) {
      if (dvA.getUint8(i) !== dvB.getUint8(i)) {
          return false;
      }
  }

  return true;
}

export const PasskeySignCounter = new Uint8Array([0, 0, 0, 0]).buffer;
export function isValidSignCounter(current: ArrayBuffer, next: ArrayBuffer) {
  if (
      isEqualBuffer(current, PasskeySignCounter) &&
      isEqualBuffer(next, PasskeySignCounter)
  ) {
      return true;
  }
  return isBiggerBuffer(next, current);
}

const UUID_V4_REGEX =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export function isUUIDv4(uuid: string) {
  return UUID_V4_REGEX.test(uuid);
}

/**
 * Returns a Response object with a JSON body
 */
export function jsonResponse(status: number, data: any, init?: ResponseInit) {
  return new NextResponse(JSON.stringify(data), {
    ...init,
    status,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  })
}
