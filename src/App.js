import OBSDock from './component/OBSDock';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <header className="App-header">
          <OBSDock />
        </header>
      </ThemeProvider>
    </div>
  );
}

export default App;
