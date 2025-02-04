export function sortObjects(a: any, b: any, propName: string = 'name') {
    const n1 = a[propName];
    const n2 = b[propName];

    if (n1 === n2) {
        return 0;
    }

    if (typeof n1 === 'string' && typeof n2 === 'string') {
        return n1.localeCompare(n2);
    }

    if(typeof n1 === 'number' && typeof n2 === 'number') {
        return n1 - n2;
    }

    return n1.toString().localeCompare(n2.toString());
}
