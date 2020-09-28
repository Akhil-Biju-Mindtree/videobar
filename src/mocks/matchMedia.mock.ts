Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: {
    matches: false,
    media: null,
    onchange: null,
  },
});
