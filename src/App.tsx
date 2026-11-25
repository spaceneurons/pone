import { useEffect } from 'react';
export default function App() {
  useEffect(() => {
    const page = new URLSearchParams(window.location.search).get('page');
    const target = page === 'boxes' ? 'boxes.html' : page === 'constructor' ? 'constructor.html' : page === 'product' ? 'product.html' : 'preview.html';
    window.location.replace(new URL(target + window.location.hash, window.location.href));
  }, []);
  return <main>Загрузка страницы…</main>;
}
