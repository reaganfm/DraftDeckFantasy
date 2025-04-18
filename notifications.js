document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('refresh-btn');
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault();
        window.location.reload();
      });
    }
  });
  