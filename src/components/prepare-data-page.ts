import m, { FactoryComponent } from 'mithril';
import { FormAttributes, LayoutForm } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';
import { DataItem, DataSet } from '../models/data-set';

// Component definition
const FileUploadComponent: FactoryComponent<{ saveModel: (ds: DataSet) => void }> = () => {
  // Function to parse CSV
  const parseCSV = (csvData: string, separator: string) => {
    const rows = csvData.split('\n');
    const dataArray = [] as DataItem[];

    rows.forEach((row) => {
      const columns = row.split(separator);
      dataArray.push({ a: columns[0], b: columns[1], reversible: true });
    });

    return dataArray;
  };

  // Function to handle file input change
  const handleFileChange = (event: Event, saveModel: (ds: DataSet) => void): void => {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      // Check if the file is a CSV file
      if (file.name.endsWith('.csv')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const csvData = e.target?.result as string;
            const items = parseCSV(csvData, ';');
            saveModel({ title: '', author: '', created: Date.now(), version: 1, items });
            m.redraw(); // Trigger a redraw to reflect changes in the UI
          } catch (error) {
            console.error('Error processing CSV file:', error);
          }
        };

        // Read the file as text
        reader.readAsText(file);
      } else {
        console.error('Please select a valid CSV file.');
      }
    }
  };

  return {
    // Mithril view function
    view: ({ attrs: { saveModel } }) => {
      return m('div', [
        m('input[type=file][title=Upload CSV file][label=form_upload]', {
          accept: '.csv',
          onchange: (e: Event) => handleFileChange(e, saveModel), // Bind the function to the component instance
        }),
      ]);
    },
  };
};

export const PrepareDataPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.PREPARATION),
  view: ({
    attrs: {
      state: {
        app: { dsModel },
      },
      actions: { saveModel },
    },
  }) => {
    return [
      m('.row', m('.col.s12.right-align', m(FileUploadComponent, { saveModel }))),
      m(
        '.row',
        m(
          '.col.s12',
          m(LayoutForm, {
            form: [
              { id: 'title', label: 'Title', type: 'text', className: 'col s6' },
              { id: 'author', label: 'Author', type: 'text', className: 'col s6' },
              {
                id: 'items',
                label: 'Definitions',
                repeat: true,
                repeatItemClass: 'from-to-definition',
                onNewItem: () => ({ reversible: true }),
                type: [
                  {
                    id: 'a',
                    label: 'From',
                    type: 'text',
                    className: 'col s6 m5',
                  },
                  {
                    id: 'b',
                    label: 'To',
                    type: 'text',
                    className: 'col s6 m5',
                  },
                  {
                    id: 'reversible',
                    label: 'Reversible',
                    type: 'switch',
                    className: 'col s12 m2',
                  },
                ],
              },
            ],
            obj: dsModel,
            onchange: () => {
              saveModel(dsModel);
            },
          } as FormAttributes<any>)
        )
      ),
    ];
  },
});
