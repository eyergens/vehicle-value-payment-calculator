import {Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import WarningIcon from '@mui/icons-material/Warning';

export default function PageNotFound() {
  return (
    <div id="error-page">
      <Typography
        sx={{fontWeight: 'bold'}}
        variant={'h3'}>404</Typography>
      <Typography
        variant={'h4'}
        gutterBottom>
        <WarningIcon sx={{mr: 1}}/>
        Oops! That page can't be found
        <WarningIcon sx={{ml: 1}}/>
      </Typography>

      <Button
        variant={'contained'}
        component={Link}
        to="/">Go Home</Button>
    </div>
  );
}