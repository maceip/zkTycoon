export function pad(s) {
    switch (s.length % 4) {
        case 0:
            return s;
        case 2:
            return s + '==';
        case 3:
            return s + '=';
        default:
            throw 'Illegal base64url string!';
    }
}
