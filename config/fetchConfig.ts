export const APP_CONFIG = `(function () {
  fetch('/api/config')
    .then(res => res.json())
    .then(data => {
      window.APP_CONFIG = data;
    })
    .catch(e => {
      console.error('Failed to fetch application config', e);
    });
})()`;
