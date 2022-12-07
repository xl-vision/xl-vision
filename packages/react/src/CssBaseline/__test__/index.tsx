import { render } from '@testing-library/react';
import { ThemeProvider, CssBaseline, BaseTheme } from '@xl-vision/react';

describe('CssBaseline', () => {
  it('basic renders', () => {
    render(
      <CssBaseline>
        <div />
      </CssBaseline>,
    );

    // TODO [2023-01-01] render css
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

    render(
      <ThemeProvider theme={baseTheme}>
        <CssBaseline>
          <div />
        </CssBaseline>
      </ThemeProvider>,
    );

    // TODO [2023-01-01] render css
    expect(document.head).toMatchSnapshot();
  });
});
