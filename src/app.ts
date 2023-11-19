import m from 'mithril';
import 'material-icons/iconfont/filled.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import './css/style.css';
import { dashboardSvc } from './services/routing-service';
import { registerPlugin } from 'mithril-ui-form';
import { lookupTable, lookupTableCreatorPlugin, tablePlugin } from './components/ui';

registerPlugin('create-lookup-table', lookupTableCreatorPlugin);
registerPlugin('lookup-table', lookupTable);
registerPlugin('table', tablePlugin);

m.route(document.body, dashboardSvc.defaultRoute, dashboardSvc.routingTable());
