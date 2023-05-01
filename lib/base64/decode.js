import { base64url } from 'rfc4648';
export function decode(s) {
    return new TextDecoder().decode(base64url.parse(s, { loose: true }));
}
