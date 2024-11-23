  import React from 'react';
  import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Collapse, Box, Typography } from '@mui/material';
  import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

  const ConsignKoiTable = ({ consignKois, startEditing, handleDelete }) => {
    const [openRow, setOpenRow] = React.useState(null);

    const toggleRow = (rowId) => {
      setOpenRow((prev) => (prev === rowId ? null : rowId));
    };
    const hasDesiredPrice = consignKois.some((koi) => koi.price > 0);
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
    return (
<TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Color</TableCell>
            {hasDesiredPrice && <TableCell>Desired Price</TableCell>}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consignKois.map((consignKoi) => (
            <React.Fragment key={consignKoi.consignmentKoiID}>
              <TableRow hover>
                <TableCell>
                  <IconButton size="small" onClick={() => toggleRow(consignKoi.consignmentKoiID)}>
                    {openRow === consignKoi.consignmentKoiID ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
                <TableCell>{consignKoi.consignmentKoiID}</TableCell>
                <TableCell>{consignKoi.name}</TableCell>
                <TableCell>{consignKoi.gender}</TableCell>
                <TableCell>{consignKoi.age}</TableCell>
                <TableCell>{consignKoi.size}</TableCell>
                <TableCell>{consignKoi.color}</TableCell>
                {hasDesiredPrice && (
                  <TableCell>
                    {formatCurrency(consignKoi.price > 0 ? consignKoi.price : '')}
                  </TableCell>
                )}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => startEditing(consignKoi)}
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(consignKoi.consignmentKoiID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={9} sx={{ padding: 0 }}>
                  <Collapse in={openRow === consignKoi.consignmentKoiID} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 2 }}>
                      <Typography variant="subtitle1">Details:</Typography>
                      <Typography variant="body2">
                        <strong>Daily Feed Amount:</strong> {consignKoi.dailyFeedAmount}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Personality:</strong> {consignKoi.personality}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Origin:</strong> {consignKoi.origin}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Species:</strong> {consignKoi.species}
                      </Typography>
                      {consignKoi.price > 0 && (
                        <Typography variant="body2">
                          <strong>Desired Price:</strong> {formatCurrency(consignKoi.price)}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        <strong>Certificates:</strong>
                      </Typography>
                      <Box display="flex" gap={2} mt={1}>
                        {consignKoi.image && (
                          <img
                            src={consignKoi.image}
                            alt="Koi Image"
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                          />
                        )}
                        {consignKoi.addOn?.originCertificate && (
                          <img
                            src={consignKoi.addOn.originCertificate}
                            alt="Origin Certificate"
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                          />
                        )}
                        {consignKoi.addOn?.healthCertificate && (
                          <img
                            src={consignKoi.addOn.healthCertificate}
                            alt="Health Certificate"
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                          />
                        )}
                        {consignKoi.addOn?.ownershipCertificate && (
                          <img
                            src={consignKoi.addOn.ownershipCertificate}
                            alt="Ownership Certificate"
                            style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    );
  };

  export default ConsignKoiTable;
