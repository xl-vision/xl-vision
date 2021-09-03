import React from 'react';
import { mount } from 'enzyme';
import CssBaseline from '..';
import ThemeProvider, { BaseTheme } from '../../ThemeProvider';

describe('CssBaseline', () => {
  it.todo('todo here');
  it('basic renders', () => {
    mount(
      <CssBaseline>
        <div />
      </CssBaseline>,
    );

    expect(document.head).toMatchSnapshot();
  });

  it('supports theme overrides', () => {
    const baseTheme: BaseTheme = {
      overrideStyles: {
        CssBaseline: {
          Root(theme) {
            return {
              body: {
                color: theme.color.themes.primary.color,
              },
            };
          },
        },
      },
    };

    mount(
      <ThemeProvider theme={baseTheme}>
        <CssBaseline>
          <div />
        </CssBaseline>
      </ThemeProvider>,
    );

    expect(document.head).toMatchSnapshot();
  });
});
