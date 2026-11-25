export default function ConstructorPage() {
  return (
    <main className="page" aria-label="Меню-конструктор">
      <div className="svg-page" style={{ aspectRatio: '1440 / 4732' }}>
        <img className="svg-page__image" src="/assets/menu-constructor.svg" alt="Меню-конструктор" />

        <a className="page-link" href="./" aria-label="На главную" style={{ left: '3.75%', top: '0.17%', width: '11.46%', height: '1.14%' }} />
        <a className="page-link" href="?page=constructor" aria-label="Меню" style={{ left: '17.1%', top: '0.17%', width: '6.5%', height: '1.14%' }} />
        <a className="page-link" href="?page=boxes" aria-label="Готовые наборы" style={{ left: '24.3%', top: '0.17%', width: '10.6%', height: '1.14%' }} />
        <a className="page-link" href="./" aria-label="На главную из хлебных крошек" style={{ left: '12%', top: '2.85%', width: '13%', height: '0.95%' }} />
      </div>
    </main>
  );
}
