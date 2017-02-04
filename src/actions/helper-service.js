class HelperService {
  // deepCopy(o, depth = 0) {
  //   console.log(`${depth} debug clone: `, o);
  //   let out, v, key;
  //   out = Array.isArray(o) ? [] : {};
  //   for (key in o) {
  //     if (o.hasOwnProperty(key)) {
  //       v = o[key];
  //       out[key] = (v && typeof v === "object" && depth < 7) ? this.deepCopy(v, ++depth) : v;
  //     }
  //   }
  //   return out;
  // }
  deepCopy(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // primitives
    if (hash.has(obj)) return hash.get(obj); // cyclic reference
    let result = Array.isArray(obj) ? [] : {};
                    // obj.constructor ? new obj.constructor() : Object.create(null);

    hash.set(obj, result);
    if (obj instanceof Map) Array.from(obj, ([key, val]) => result.set(key, this.deepCopy(val, hash)));

    return Object.assign(result, ...Object.keys(obj).map(key =>
      ({ [key]: this.deepCopy(obj[key], hash) })
    ));
  }
  reverseArray(array) {
    return array.slice(0).reverse();
  }
  isBetween(num1, num2, middleNumber) {
    if (num1 < middleNumber && middleNumber < num2) return true;
    if (num1 > middleNumber && middleNumber > num2) return true;
    return false;
  }
  isOnDiagonal(fileIndex, from, to, square) {
    const fileDiff = Math.abs(fileIndex - from.fileIndex);
    const rankDiff = Math.abs(square.rank - from.rank);
    if (!(fileDiff === rankDiff)) return false;
    if (!this.isBetween(from.rank, to.rank, square.rank)) return false;
    if (!this.isBetween(from.fileIndex, to.fileIndex, fileIndex)) return false;
    return true;
  }
  isFromSquare({ rank, file }, square) {
    return rank === square.rank && file === square.file;
  }
}

export default new HelperService();
