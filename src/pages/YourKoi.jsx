import { useEffect, useState } from 'react';
import api from '../config/axios';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Dialog, 
  CircularProgress, 
  Button, 
  DialogTitle, 
  DialogContent, 
  Table, 
  TableBody, 
  TableRow, 
  TableCell, 
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';

const YourKoi = () => {
  const [kois, setKois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedKoi, setSelectedKoi] = useState(null);
  const [openKoiDetailsModal, setOpenKoiDetailsModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredKois, setFilteredKois] = useState([]);

  const statusLabel = {
    0: "Bought",
    1: "Foster",
    2: "Sold"
  };

  useEffect(() => {
    const fetchUserKois = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get('/KoiInventory/userKoiInventory', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setKois(response.data);
        setFilteredKois(response.data);
      } catch (err) {
        setError(err.response ? `API Error: ${err.response.status} - ${err.response.data.message}` : 'Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserKois();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      setFilteredKois(kois);
    } else {
      const statusFilter = newValue - 1;
      setFilteredKois(kois.filter(koi => koi.status === statusFilter));
    }
  };

  const handleViewKoiDetails = (koi) => {
    setSelectedKoi(koi);
    setOpenKoiDetailsModal(true);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography color="error">{error}</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 4, color: '#333', backgroundColor: '#fff' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ paddingBottom: 3, fontWeight: "bold", color: "#000" }}>
        Your Koi Collection
      </Typography>

      <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{ mb: 3, color: "#000" }}>
        <Tab label="All" />
        <Tab label="Bought" />
        <Tab label="Foster" />
        <Tab label="Sold" />
      </Tabs>

      {filteredKois.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No koi fish found in this category
        </Typography>
      ) : (
        filteredKois.map(koi => (
          <Card key={koi.koiInventoryID} sx={{ marginBottom: 3, padding: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#f9f9f9", color: '#000' }}>
            <CardContent>
              {koi.image && (
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={koi.image} 
                    alt={koi.name} 
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Box>
              )}
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Name:</strong></TableCell>
                    <TableCell>{koi.name || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Species:</strong></TableCell>
                    <TableCell>{koi.species}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Size:</strong></TableCell>
                    <TableCell>{koi.size}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Status:</strong></TableCell>
                    <TableCell>{statusLabel[koi.status]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Price:</strong></TableCell>
                    <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(koi.price)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button
                variant="contained"
                onClick={() => handleViewKoiDetails(koi)}
                sx={{ mt: 2, color: "#fff", backgroundColor: "#000" }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))
      )}

      {/* Koi Details Modal */}
      <Dialog open={openKoiDetailsModal} onClose={() => setOpenKoiDetailsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Koi Details</DialogTitle>
        <DialogContent>
          {selectedKoi && (
            <>
              {selectedKoi.image && (
                <Box sx={{ mb: 2, mt: 2 }}>
                  <img 
                    src={selectedKoi.image} 
                    alt={selectedKoi.name} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                </Box>
              )}
              <Typography variant="body1"><strong>Name:</strong> {selectedKoi.name || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Species:</strong> {selectedKoi.species}</Typography>
              <Typography variant="body1"><strong>Gender:</strong> {selectedKoi.gender || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Age:</strong> {selectedKoi.age ? `${selectedKoi.age} years` : 'N/A'}</Typography>
              <Typography variant="body1"><strong>Size:</strong> {selectedKoi.size}</Typography>
              <Typography variant="body1"><strong>Color:</strong> {selectedKoi.color || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Daily Feed Amount:</strong> {selectedKoi.dailyFeedAmount || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedKoi.price)}</Typography>
              {selectedKoi.fosterPrice && (
                <Typography variant="body1"><strong>Foster Price:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedKoi.fosterPrice)}</Typography>
              )}
              <Typography variant="body1"><strong>Personality:</strong> {selectedKoi.personality || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Origin:</strong> {selectedKoi.origin || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Selection Rate:</strong> {selectedKoi.selectionRate || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Status:</strong> {statusLabel[selectedKoi.status]}</Typography>
              {selectedKoi.startDate && (
                <Typography variant="body1"><strong>Start Date:</strong> {new Date(selectedKoi.startDate).toLocaleDateString()}</Typography>
              )}
              {selectedKoi.endDate && (
                <Typography variant="body1"><strong>End Date:</strong> {new Date(selectedKoi.endDate).toLocaleDateString()}</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenKoiDetailsModal(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default YourKoi; 