import { base64url } from 'rfc4648';
export function encode(s) {
    return base64url.stringify(new TextEncoder().encode(s), { pad: false });
}
