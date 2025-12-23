import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';


const NAVIGATION = [
  {
    segment: 'DashBoard',
    title: 'Dashboard',

  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function PageContainerFullScreen(props) {
  const { window } = props;


  return (
      <AppProvider
        //navigation={NAVIGATION}
        //router={router}
        //theme={demoTheme}
        //window={demoWindow}
      >
        <DashboardLayout defaultSidebarCollapsed>
          <PageContainer>
          </PageContainer>
        </DashboardLayout>
      </AppProvider>

  );
}



export default PageContainerFullScreen;