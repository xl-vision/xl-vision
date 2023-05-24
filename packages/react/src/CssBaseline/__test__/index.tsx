import { render } from '@testing-library/react';
import { ThemeProvider, CssBaseline, ThemeInput } from '@xl-vision/react';

describe('CssBaseline', () => {
  it('basic renders', () => {
    render(
      <CssBaseline>
        <div />
      </CssBaseline>,
    );

    // TODO [2023-07-01] render css
    expect(document.head).toMatchSnapshot();
  });

  it('supports theme overrides', () => {
    const baseTheme: ThemeInput = {
      overrideStyles: {
        CssBaseline: {
          Root(theme) {
            return {
              body: {
                color: theme.colors.themes.primary.foreground.enabled,
              },
            };
          },
        },
      },
    };

    render(
      <ThemeProvider {...baseTheme}>
        <CssBaseline>
          <div />
        </CssBaseline>
      </ThemeProvider>,
    );

    // TODO [2023-07-01] render css
    expect(document.head).toMatchSnapshot();
  });
});
