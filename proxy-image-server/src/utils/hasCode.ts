function hashCode(s: string): number {
  let hash = 5381;

  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) + hash + char; /* hash * 33 + char */
  }

  return hash;
}

export default hashCode;
