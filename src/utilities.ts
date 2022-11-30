export function GUID() {
  let a, b, c, d;
  a = Math.floor(Math.random() * 0x10000).toString(16);
  b = Math.floor(Math.random() * 0x10000).toString(16);
  c = Math.floor(Math.random() * 0x10000).toString(16);
  d = Math.floor(Math.random() * 0x10000).toString(16);
  return `${a}-${b}-${c}-${d}`;
}
