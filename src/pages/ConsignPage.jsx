import { useEffect, useState } from 'react';
import api from '../config/axios';
import { Tab, Tabs, Card, CardContent, Typography, Box, Dialog, CircularProgress, Button, DialogTitle, DialogContent, Table, TableBody, TableRow, TableCell, DialogActions, Select, MenuItem, TextField } from '@mui/material';
import { DatePicker } from 'antd';
import { isBefore, parseISO, differenceInDays } from 'date-fns';

const ConsignPage = ({ token }) => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const statusLabel = {
    0: "Awaiting Payment",
    1: "Available",
    2: "Finished",
    3: "Raising",
    4: "Pending",
    5: "Negotiate",
  };
  const [openKoiDetailsModal, setOpenKoiDetailsModal] = useState(false);
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
        setConsignments(response.data);
        setFilteredConsignments(response.data);
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
      setFilteredConsignments(consignments.filter(consignment => consignment.status === statusFilter));
    }
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
      {filteredConsignments.map(consignment => (
        <Card key={consignment.consignmentID} sx={{ marginBottom: 3, padding: 2, boxShadow: 3, borderRadius: 2, backgroundColor: "#f9f9f9", color: '#000' }}>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><strong>Consignment ID:</strong></TableCell>
                  <TableCell>{consignment.consignmentID}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Type:</strong></TableCell>
                  <TableCell>{consignment.type === 0 ? 'Sell' : 'Foster'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>Foster Price:</strong></TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(consignment.fosterPrice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><strong>End Date:</strong></TableCell>
                  <TableCell>{new Date(consignment.endDate).toLocaleDateString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleViewKoiDetails(consignment)}
              sx={{ mt: 2, color: "#000", borderColor: "#000", mr: 5 }}
            >
              View Koi Details
            </Button>
            {isBefore(parseISO(consignment.endDate), new Date()) && (
              <Button variant="contained" color="default" onClick={() => handleReconsignClick(consignment)} sx={{ mt: 2, color: "#fff", backgroundColor: "#000" }}>
                Reconsign
              </Button>
            )}
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
    </Box>
  );
};

export default ConsignPage;
