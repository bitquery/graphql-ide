export default function debounce (
  duration,
  fn,
) {
  let timeout;
  return function (that, ...args) {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = window.setTimeout(() => {
      timeout = null;
      fn.apply(that, args);
    }, duration);
  };
}
