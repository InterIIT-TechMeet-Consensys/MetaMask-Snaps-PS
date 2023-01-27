// import React, { useRef } from 'react';
//
// const styles = {
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '1rem',
//     width: '36rem',
//     height: '30rem',
//     backgroundColor: '#ff034a',
//     borderRadius: 12,
//     borderColor: 'black',
//     borderWidth: 1,
//   },
//   rowInputs: {
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   smallInput: {
//     width: '8rem',
//     margin: '0.5rem',
//     height: '3rem',
//     borderRadius: 6,
//     borderColor: 'black',
//     borderWidth: 1,
//   },
//   mediumInput: {
//     width: '22rem',
//     margin: '0.5rem',
//     height: '3rem',
//     borderRadius: 6,
//     borderColor: 'black',
//     borderWidth: 1,
//   },
//   bigInput: {
//     width: '31rem',
//     marginTop: '0.5rem',
//     height: '10rem',
//     borderRadius: 6,
//     borderColor: 'black',
//     borderWidth: 1,
//   },
//   submitButton: {
//     width: '10rem',
//     height: '4rem',
//     borderRadius: 6,
//     marginRight: '1.65rem',
//     marginTop: '1rem',
//   },
//   clearButton: {
//     width: '10rem',
//     height: '4rem',
//     borderRadius: 6,
//     marginLeft: '1.65rem',
//     marginTop: '1rem',
//     backgroundColor: 'transparent',
//     borderWidth: 1,
//     borderColor: '#ffffff',
//     color: '#ffffff',
//   },
//   buttons: {
//     display: 'flex',
//     flexDirection: 'row',
//     width: '100%',
//     justifyContent: 'space-between',
//   },
//   inputs: {
//     display: 'flex',
//     flexDirection: 'column',
//     color: 'white',
//     fontSize: '1.25rem',
//     marginTop: '1rem',
//   },
// };
//
// const RequestForm = () => {
//   const amountInputRef = useRef<HTMLInputElement>(null);
//   const addressInputRef = useRef<HTMLInputElement>(null);
//   const descriptionInputRef = useRef<HTMLTextAreaElementElement>(null);
//
//   return (
//     <form style={styles.form}>
//       <div style={styles.rowInputs}>
//         <div style={styles.inputs}>
//           <label htmlFor="address">Wallet Address</label>
//           <input
//             id="address"
//             style={styles.mediumInput}
//             type="text"
//             ref={addressInputRef}
//           />
//         </div>
//         <div style={styles.inputs}>
//           <label htmlFor="amount">Amount</label>
//           <input
//             id="amount"
//             style={styles.smallInput}
//             type="text"
//             ref={amountInputRef}
//           />
//         </div>
//       </div>
//       <div style={styles.inputs}>
//         <label htmlFor="description">Description</label>
//         <textarea
//           id="description"
//           style={styles.bigInput}
//           type="text"
//           ref={descriptionInputRef}
//         />
//       </div>
//       <div style={styles.buttons}>
//         <button style={styles.clearButton}>Clear</button>
//         <button style={styles.submitButton}>Submit</button>
//       </div>
//     </form>
//   );
// };
//
// export default RequestForm;

import React from 'react';
import Box from '@mui/material/Box';
import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';

const RequestForm = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Box
        sx={{
          margin: '1rem',
        }}
      >
        <Typography variant="h4">Request Ether</Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '1rem',
        }}
      >
        <TextField
          style={{
            width: '45rem',
            marginRight: '1rem',
          }}
          id="outlined-basic"
          label="Wallet Address"
          variant="outlined"
        />
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            style={{
              width: '14rem',
              fontSize: '1.5rem',
            }}
            type="number"
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">Ξ</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Box>
      <TextField
        id="outlined-multiline-static"
        label="Description"
        multiline
        rows={12}
        variant="outlined"
        style={{
          width: '60rem',
        }}
      />
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.65rem',
        }}
      >
        <Button
          variant="outlined"
          style={{
            margin: '1rem',
            width: '15rem',
          }}
        >
          Clear
        </Button>
        <Button variant="contained" style={{ margin: '1rem', width: '15rem' }}>
          Request
        </Button>
      </Box>
    </Box>
  );
};

export default RequestForm;
