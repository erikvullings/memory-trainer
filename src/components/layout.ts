import m from 'mithril';
import { Icon } from 'mithril-materialized';
import logo from '../assets/logo.svg';
import { IDashboard } from '../models';
import { dashboardSvc } from '../services/routing-service';
import { MeiosisComponent } from '../services';

export const Layout: MeiosisComponent = () => ({
  view: ({
    children,
    attrs: {
      state: {
        app: { page },
      },
      actions: { changePage },
    },
  }) => {
    const isActive = (d: IDashboard) => (page === d.id ? '.active' : '');

    return m('.main', { style: 'overflow-x: hidden' }, [
      m(
        '.navbar-fixed',
        { style: 'z-index: 1001' },
        m(
          'nav',
          m('.nav-wrapper', [
            m('a.brand-logo[href=#].hide-on-med-and-down', { style: 'margin-left: 20px' }, [
              m(`img[width=50][height=50][src=${logo}]`, {
                style: 'margin-top: 5px; margin-left: -5px;',
              }),
              m(
                'div',
                {
                  style:
                    'margin-top: 0px; position: absolute; top: 10px; left: 60px; width: 240px;',
                },
                m(
                  'h4.center.show-on-med-and-up.black-text',
                  { style: 'text-align: left; margin: 0;' },
                  'Memory Trainer'
                )
              ),
            ]),
            m(
              // 'a.sidenav-trigger[href=#!/home][data-target=slide-out]',
              // { onclick: (e: UIEvent) => e.preventDefault() },
              m.route.Link,
              {
                className: 'sidenav-trigger',
                'data-target': 'slide-out',
                href: m.route.get(),
              },
              m(Icon, {
                iconName: 'menu',
                className: 'hide-on-med-and-up black-text',
                style: 'margin-left: 5px;',
              })
            ),
            m(
              'ul.right',
              dashboardSvc
                .getList()
                .filter(
                  (d) => (typeof d.visible === 'boolean' ? d.visible : d.visible()) || isActive(d)
                )
                .map((d: IDashboard) =>
                  m(`li.tooltip${isActive(d)}`, [
                    m(Icon, {
                      className: 'hoverable' + (d.iconClass ? ` ${d.iconClass}` : ''),
                      style: 'font-size: 2.2rem; width: 4rem;',
                      iconName: typeof d.icon === 'string' ? d.icon : d.icon(),
                      onclick: () => changePage(d.id),
                    }),
                    m(
                      'span.tooltiptext',
                      (typeof d.title === 'string' ? d.title : d.title()).toUpperCase()
                    ),
                  ])
                )
            ),
          ])
        )
      ),
      m('.container', { style: 'padding-top: 1rem' }, children),
    ]);
  },
});
