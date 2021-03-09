import { createMuiTheme } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,
    h1: {
      // could customize the h1 variant as well
    },
    subtitle1: {
      fontSize: 10,
      color: grey[500],
    },
  },
  palette: {
    primary: { main: "#DF1B1B" },
  },
});
