import WidgetClassImporter from "./importers/WidgetClassImporter";
import ViewClassImporter from "./importers/ViewClassImporter";
import Router from "./Router";

type Route = WidgetClassImporter | ViewClassImporter | Router;
export default Route;