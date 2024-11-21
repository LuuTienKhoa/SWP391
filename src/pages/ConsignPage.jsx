import { useEffect, useState } from 'react';
import api from '../config/axios';
import { Tab, Tabs, Card, CardContent, Typography, Box, Dialog, CircularProgress, Button, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell, DialogActions, Select, MenuItem, TextField } from '@mui/material';
import { DatePicker } from 'antd';
import { isBefore, parseISO, differenceInDays } from 'date-fns';
import Pagination from '../components/Pagination';
const ConsignPage = ({ token }) => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [openReconsignModal, setOpenReconsignModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [reconsignDetails, setReconsignDetails] = useState({
    startDate: null,
    endDate: null,
    priceListId: null,
    type: selectedConsignment?.type || 0,// Default to the existing type (0 for sell, 1 for foster)
    name: "",
    species: "",
    color: "",
    size: "",
    dailyFeedAmount: "",
    personality: "",
    origin: "",
  });
  const [selectedTab, setSelectedTab] = useState(0);
  const [filteredConsignments, setFilteredConsignments] = useState([]);
  const dailyCostOptions = { 1: 100000, 2: 150000, 3: 250000, 5: 500000 };
  const getStatusLabel = (status) => {
    switch (status) {
        case 0:
            return "Awaiting for Payment";
        case 1:
            return "Available";
        case 2:
            return "Finished";
        case 3:
            return "Raising";
        case 4:
            return "Pending";
        case 5:
            return "Negotiate";
        default:
            return "Unknown Status";
    }
};
  const [openKoiDetailsModal, setOpenKoiDetailsModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const handleViewKoiDetails = (consignment) => {
    setSelectedConsignment(consignment);
    setOpenKoiDetailsModal(true);
  };
  const handleStartDateChange = (date) => {
    setReconsignDetails((prev) => ({ ...prev, startDate: date }));
  };

  const handleEndDateChange = (date) => {
    if (reconsignDetails.startDate && date.isBefore(reconsignDetails.startDate)) {
      alert("End date cannot be earlier than the start date");
    } else {
      setReconsignDetails((prev) => ({ ...prev, endDate: date }));
    }
  };
  useEffect(() => {
    const fetchUserConsignments = async () => {
      try {
        const response = await api.get('/Consignment/CustomerConsignment', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedData = response.data.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        setConsignments(sortedData);
        setFilteredConsignments(sortedData);
      } catch (err) {
        setError(err.response ? `API Error: ${err.response.status} - ${err.response.data.message}` : 'Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserConsignments();
  }, [token]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      setFilteredConsignments(consignments);
    } else {
      const statusFilter = newValue - 1;
      setFilteredConsignments(
        consignments.filter((consignment) => consignment.status === statusFilter)
      );
    }
    setCurrentPage(1); 
  };

  const handleReconsignClick = (consignment) => {
    setSelectedConsignment(consignment);
    const koi = consignment.consignmentKois?.[0] || {};
    setReconsignDetails({
      startDate: null,
      endDate: null,
      priceListId: consignment.priceListId || 1,
      name: koi.name || "",
      species: koi.species || "",
      color: koi.color || "",
      size: koi.size || "",
      dailyFeedAmount: koi.dailyFeedAmount || "",
      personality: koi.personality || "",
      origin: koi.origin || "",
    });
    setOpenReconsignModal(true);
  };

  const handleInputChange = (field, value) => {
    setReconsignDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirmReconsignment = async () => {
    if (!reconsignDetails.startDate || !reconsignDetails.endDate) {
      alert("Please select valid start and end dates.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to reconsign.");
        return;
      }

      const formData = new FormData();
      formData.append("consignmentID", selectedConsignment.consignmentID);
      formData.append("startDate", reconsignDetails.startDate.toISOString());
      formData.append("endDate", reconsignDetails.endDate.toISOString());
      formData.append("priceListId", reconsignDetails.priceListId);
      formData.append("name", reconsignDetails.name);
      formData.append("species", reconsignDetails.species);
      formData.append("color", reconsignDetails.color);
      formData.append("size", reconsignDetails.size);
      formData.append("dailyFeedAmount", reconsignDetails.dailyFeedAmount);
      formData.append("personality", reconsignDetails.personality);
      formData.append("origin", reconsignDetails.origin);
      formData.append("fosterPrice", selectedConsignment.fosterPrice);

      await api.post("/Consignment/pending", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
      });

      alert("Reconsignment request submitted successfully!");
      setOpenReconsignModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to submit reconsignment request. Please try again.");
    }
  };

  const handleViewDetails = (consignment) => {
    setSelectedConsignment(consignment);
    setOpenDetailsModal(true);
  };


 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsignments.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) return <CircularProgress />;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 4, color: '#333', backgroundColor: '#fff' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ paddingBottom: 3, fontWeight: "bold", color: "#000" }}>
        Your Consignment
      </Typography>
      <Tabs value={selectedTab} onChange={handleTabChange} centered sx={{ mb: 3, color: "#000" }}>
        <Tab label="All" />
        <Tab label="Awaiting Payment" />
        <Tab label="Available" />
        <Tab label="Finished" />
        <Tab label="Raising" />
        <Tab label="Pending" />
        <Tab label="Negotiate" />
      </Tabs>
      {currentItems.map(consignment => (
        <Card key={consignment.consignmentID} sx={{ marginBottom: 3, padding: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#f9f9f9", color: '#000' }}>
          <CardContent>
            {consignment.consignmentKois?.[0]?.image && (
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={consignment.consignmentKois[0].image} 
                  alt="Koi fish"
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    maxHeight: '300px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }} 
                />
              </Box>
            )}
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Type:</strong></TableCell>
                  <TableCell>{consignment.type === 0 ? 'Sell' : 'Foster'}</TableCell>
                </TableRow>
                {consignment.consignmentKois?.[0] && (
                  <>
                    <TableRow>
                      <TableCell><strong>Koi Name:</strong></TableCell>
                      <TableCell>{consignment.consignmentKois[0].name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Species:</strong></TableCell>
                      <TableCell>{consignment.consignmentKois[0].species}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Origin:</strong></TableCell>
                      <TableCell>{consignment.consignmentKois[0].origin}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Status:</strong></TableCell>
                      <TableCell>{getStatusLabel(consignment.status)}</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined"
                onClick={() => handleViewDetails(consignment)}
                sx={{ color: "#000", borderColor: "#000" }}
              >
                View Details
              </Button>
              {isBefore(parseISO(consignment.endDate), new Date()) && (
                <Button 
                  variant="contained" 
                  color="default" 
                  onClick={() => handleReconsignClick(consignment)} 
                  sx={{ color: "#fff", backgroundColor: "#000" }}
                >
                  Reconsign
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}

      {/*Reconsign modal*/}
      <Dialog open={openReconsignModal} onClose={() => setOpenReconsignModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reconsign Your Fish</DialogTitle>
        <DialogContent>
          <DatePicker
            value={reconsignDetails.startDate}
            onChange={handleStartDateChange}
            placeholder="Select Start Date"
            getPopupContainer={(trigger) => trigger.parentNode}  // This line helps render the calendar within the modal
            style={{ width: "100%", marginBottom: 8 }}
          />
          <DatePicker
            value={reconsignDetails.endDate}
            onChange={handleEndDateChange}
            placeholder="Select End Date"
            getPopupContainer={(trigger) => trigger.parentNode}  // Ensures the end date picker also appears correctly
            style={{ width: "100%", marginBottom: 8 }}
          />
          <Select value={reconsignDetails.priceListId} onChange={(e) => handleInputChange("priceListId", e.target.value)} fullWidth sx={{ mb: 2 }}>
            {Object.entries(dailyCostOptions).map(([id, price]) => (
              <MenuItem key={id} value={id}>{`Option ${id} - ${price.toLocaleString()} VND/day`}</MenuItem>
            ))}
          </Select>
          <Select
            value={reconsignDetails.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value={0}>Sell</MenuItem>
            <MenuItem value={1}>Foster</MenuItem>
          </Select>
          <TextField label="Name" value={reconsignDetails.name} onChange={(e) => handleInputChange("name", e.target.value)} fullWidth margin="dense" />
          <TextField label="Species" value={reconsignDetails.species} onChange={(e) => handleInputChange("species", e.target.value)} fullWidth margin="dense" />
          <TextField label="Color" value={reconsignDetails.color} onChange={(e) => handleInputChange("color", e.target.value)} fullWidth margin="dense" />
          <TextField label="Size (cm)" value={reconsignDetails.size} onChange={(e) => handleInputChange("size", e.target.value)} fullWidth margin="dense" />
          <TextField label="Daily Feed Amount (grams)" value={reconsignDetails.dailyFeedAmount} onChange={(e) => handleInputChange("dailyFeedAmount", e.target.value)} fullWidth margin="dense" />
          <TextField label="Personality" value={reconsignDetails.personality} onChange={(e) => handleInputChange("personality", e.target.value)} fullWidth margin="dense" />
          <TextField label="Origin" value={reconsignDetails.origin} onChange={(e) => handleInputChange("origin", e.target.value)} fullWidth margin="dense" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReconsignModal(false)} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmReconsignment} sx={{ color: "#fff", backgroundColor: "#000" }}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/*Koi Information detail*/}
      <Dialog open={openKoiDetailsModal} onClose={() => setOpenKoiDetailsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Koi Information Details</DialogTitle>
        <DialogContent>
          {selectedConsignment && selectedConsignment.consignmentKois?.[0] && (
            <>
              <Typography variant="body1"><strong>Name:</strong> {selectedConsignment.consignmentKois[0].name}</Typography>
              <Typography variant="body1"><strong>Species:</strong> {selectedConsignment.consignmentKois[0].species}</Typography>
              <Typography variant="body1"><strong>Color:</strong> {selectedConsignment.consignmentKois[0].color}</Typography>
              <Typography variant="body1"><strong>Size (cm):</strong> {selectedConsignment.consignmentKois[0].size}</Typography>
              <Typography variant="body1"><strong>Daily Feed Amount (grams):</strong> {selectedConsignment.consignmentKois[0].dailyFeedAmount}</Typography>
              <Typography variant="body1"><strong>Personality:</strong> {selectedConsignment.consignmentKois[0].personality}</Typography>
              <Typography variant="body1"><strong>Origin:</strong> {selectedConsignment.consignmentKois[0].origin}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenKoiDetailsModal(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Complete Koi and Consignment Information */}
      <Dialog open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Consignment Details</DialogTitle>
        <DialogContent>
          {selectedConsignment && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}></Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Type:</strong></TableCell>
                    <TableCell>{selectedConsignment.type === 0 ? 'Sell' : 'Foster'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Status:</strong></TableCell>
                    <TableCell>{getStatusLabel(selectedConsignment.status)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Foster Price:</strong></TableCell>
                    <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedConsignment.fosterPrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Start Date:</strong></TableCell>
                    <TableCell>{new Date(selectedConsignment.startDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>End Date:</strong></TableCell>
                    <TableCell>{new Date(selectedConsignment.endDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Created At:</strong></TableCell>
                    <TableCell>{new Date(selectedConsignment.createAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {selectedConsignment.consignmentKois?.[0] && (
                <>
                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Koi Details</Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Name:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Species:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].species}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Gender:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].gender}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Age:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].age} months</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Size:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].size} cm</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Color:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].color}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Daily Feed Amount:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].dailyFeedAmount} grams</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Personality:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].personality}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Origin:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].origin}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Selection Rate:</strong></TableCell>
                        <TableCell>{selectedConsignment.consignmentKois[0].selectionRate}</TableCell>
                      </TableRow>
                      {selectedConsignment.type === 0 && (
                        <TableRow>
                          <TableCell><strong>Price:</strong></TableCell>
                          <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedConsignment.consignmentKois[0].price)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsModal(false)} sx={{ color: "#000" }}>Close</Button>
        </DialogActions>
      </Dialog>
      <Pagination
        totalPosts={filteredConsignments.length}
        postPerPage={itemsPerPage}
        paginate={paginate}
      />
    </Box>
  );
};

export default ConsignPage;
