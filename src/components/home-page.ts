import m from 'mithril';
import lz from 'lz-string';
import { Button, Icon, ModalPanel } from 'mithril-materialized';
import background from '../assets/background.jpg';
import { dashboardSvc, MeiosisComponent } from '../services';
import { Dashboards } from '../models';
import { formatDate } from '../utils';
import { DataSet } from '../models/data-set';

export const HomePage: MeiosisComponent = () => {
  const readerAvailable = window.File && window.FileReader && window.FileList && window.Blob;

  return {
    oninit: ({
      attrs: {
        actions: { setPage, saveModel, changePage },
      },
    }) => {
      setPage(Dashboards.HOME);
      const model = m.route.param('model');
      if (!model) return;
      try {
        const decompressed = lz.decompressFromEncodedURIComponent(model);
        if (!decompressed) return;
        const catModel = JSON.parse(decompressed);
        saveModel(catModel);
        changePage(Dashboards.TRAIN);
      } catch (err) {
        console.error(err);
      }
    },
    view: ({
      attrs: {
        state: {
          app: { dsModel },
        },
        actions: { saveModel },
      },
    }) => [
      m('div', { style: 'position: relative;' }, [
        m(
          '.overlay.center',
          {
            style: 'position: absolute; width: 100%',
          },
          [m('h3.white-text', 'Memory Trainer')]
        ),
        m('img.responsive-img.center', { src: background }),
        m('.buttons.center', { style: 'margin: 10px auto;' }, [
          m(Button, {
            iconName: 'play_arrow',
            className: 'btn-large',
            label: 'Start',
            onclick: () => {
              dashboardSvc.switchTo(Dashboards.TRAIN);
            },
          }),
          typeof dsModel.version === 'number' &&
            m(Button, {
              iconName: 'edit',
              className: 'btn-large',
              label: 'Create new',
              modalId: 'clearAll',
            }),
          m('a#downloadAnchorElem', { style: 'display:none' }),
          m(Button, {
            iconName: 'download',
            className: 'btn-large',
            label: 'Download',
            onclick: () => {
              const dlAnchorElem = document.getElementById('downloadAnchorElem');
              if (!dlAnchorElem) return;
              const version = typeof dsModel.version === 'undefined' ? 1 : dsModel.version++;
              const dataStr =
                'data:text/json;charset=utf-8,' +
                encodeURIComponent(JSON.stringify({ ...dsModel, version }, null, 2));
              dlAnchorElem.setAttribute('href', dataStr);
              dlAnchorElem.setAttribute(
                'download',
                `${formatDate()}_v${version}_capability_model.json`
              );
              dlAnchorElem.click();
            },
          }),
          m('input#selectFiles[type=file]', { style: 'display:none' }),
          readerAvailable &&
            m(Button, {
              iconName: 'upload',
              className: 'btn-large',
              label: 'Upload',
              onclick: () => {
                const fileInput = document.getElementById('selectFiles') as HTMLInputElement;
                fileInput.onchange = () => {
                  if (!fileInput) return;
                  const files = fileInput.files;
                  if (files && files.length <= 0) {
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (e: ProgressEvent<FileReader>) => {
                    const result =
                      e &&
                      e.target &&
                      e.target.result &&
                      (JSON.parse(e.target.result.toString()) as DataSet);
                    result && result.version && saveModel(result);
                  };
                  const data = files && files.item(0);
                  data && reader.readAsText(data);
                  dashboardSvc.switchTo(Dashboards.TRAIN);
                };
                fileInput.click();
              },
            }),
          m(Button, {
            iconName: 'link',
            className: 'btn-large',
            label: 'Permalink',
            onclick: () => {
              const permLink = document.createElement('input') as HTMLInputElement;
              document.body.appendChild(permLink);
              if (!permLink) return;
              const compressed = lz.compressToEncodedURIComponent(JSON.stringify(dsModel));
              const url = `${window.location.href}${
                /\?/.test(window.location.href) ? '&' : '?'
              }model=${compressed}`;
              permLink.value = url;
              permLink.select();
              permLink.setSelectionRange(0, 999999); // For mobile devices
              try {
                const successful = document.execCommand('copy');
                if (successful)
                  M.toast({
                    html: 'Copied permanent link to clipboard.',
                    classes: 'yellow black-text',
                  });
              } catch (err) {
                M.toast({ html: 'Failed copying link to clipboard: ' + err, classes: 'red' });
              } finally {
                document.body.removeChild(permLink);
              }
            },
          }),
        ]),
        m(
          '.section.white',
          m('.row.container.center', [
            m('.row', [
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'edit' })),
                  m('h5.center', 'Create'),
                  m('p.light', 'Create a set of words and their meanings and you are good to go!'),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'flash_on' })),
                  m('h5.center', 'Assess'),
                  m(
                    'p.light',
                    `Your progress is continuously measured, and you can stop any time.`
                  ),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.icon-block', [
                  m('.center', m(Icon, { iconName: 'group' })),
                  m('h5.center', 'Share'),
                  m('p.light', 'Share your work with others by sending them your permalink.'),
                ])
              ),
            ]),
          ])
        ),
        m(ModalPanel, {
          id: 'clearAll',
          title: 'Do you really want to delete everything?',
          description: 'Are you sure that you want to delete your model?',
          buttons: [
            {
              label: 'Yes',
              iconName: 'delete',
              onclick: () => {
                // saveModel(defaultCapabilityModel);
                dashboardSvc.switchTo(Dashboards.PREPARATION);
              },
            },
            { label: 'No', iconName: 'cancel' },
          ],
        }),
      ]),
    ],
  };
};
