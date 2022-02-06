import m, { Attributes, FactoryComponent } from 'mithril';

export const CircularSpinner: FactoryComponent<Attributes> = () => {
  return {
    view: ({ attrs: { className, style } = {} }) => {
      className = className || 'center-align';
      style = style || 'margin-top: 20%;';
      return m(
        'div',
        { className, style },
        m(
          '.preloader-wrapper.big.active',
          m('.spinner-layer.spinner-blue-only', [
            m('.circle-clipper.left', m('.circle')),
            m('.gap.patch', m('.circle')),
            m('.circle-clipper.right', m('.circle')),
          ])
        )
      );
    },
  };
};
