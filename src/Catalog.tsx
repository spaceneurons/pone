import CatalogBackground from "./sections/CatalogBackground";
import OfficeBox from "./sections/OfficeBox";
import FruitBox from "./sections/FruitBox";
import FishBox from "./sections/FishBox";
import OfficeBoxSecond from "./sections/OfficeBoxSecond";
import HomeBox from "./sections/HomeBox";
import OfficeBoxThird from "./sections/OfficeBoxThird";
import CatalogHeading from "./sections/CatalogHeading";
import CatalogFooter from "./sections/CatalogFooter";
import CatalogRequest from "./sections/CatalogRequest";
import CatalogHeader from "./sections/CatalogHeader";
import CatalogDefinitions from "./CatalogDefinitions";
export default function Catalog() { return (<main className="page" aria-label="Готовые фудбоксы"><svg className="design" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="1440" height="3276" viewBox="0 0 1440 3276" fill="none"><g clipPath="url(#clip0_234_31)"><CatalogBackground />
<OfficeBox />
<FruitBox />
<FishBox />
<OfficeBoxSecond />
<HomeBox />
<OfficeBoxThird />
<CatalogHeading />
<CatalogFooter />
<CatalogRequest />
<CatalogHeader /></g><CatalogDefinitions /><a href={"?page=product"} aria-label={"Открыть карточку фудбокса"} className="nav-link"><rect x={926} y={439} width={364} height={405} fill="transparent" pointerEvents="all" /></a></svg></main>); }
