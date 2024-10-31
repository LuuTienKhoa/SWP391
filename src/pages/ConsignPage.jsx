import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { Card, CardContent, Typography,Box,Dialog} from '@mui/material';

const ConsignPage = ({ token }) => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const fetchUserConsignments = async () => {
      try {
        const response = await api.get('/ConsignmentKoi/GetConsignmentKoisByUserID', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setConsignments(response.data);
      } catch (err) {
        if (err.response) {
          setError(`API Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          setError('No response received from API');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserConsignments();
  }, [token]);
  const handleClickImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Consignments</h1>
      <div>
        {consignments.map(consignment => (
          <Card key={consignment.consignmentKoiID} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">Consignment Koi ID: {consignment.consignmentKoiID}</Typography>
              <Typography variant="body1">Name: {consignment.name}</Typography>
              <Typography variant="body2">Gender: {consignment.gender}</Typography>
              <Typography variant="body2">Age: {consignment.age}</Typography>
              <Typography variant="body2">Color: {consignment.color}</Typography>
              <Typography variant="body2">Origin: {consignment.origin}</Typography>
              <Typography variant="body2">Species: {consignment.species}</Typography>
              <Typography variant="body2">Fostering Days: {consignment.fosteringDays}</Typography>
              <Typography variant="body2">Price: {consignment.price}</Typography>

              {/* Display Certificates */}
              {consignment.addOn && (
                <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                  {consignment.image && (
                    <Box>
                      <img
                        src={consignment.addOn.originCertificate}
                        alt="Consign Image"
                        className="consign-mage"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                        onClick={() => handleClickImage(consignment.addOn.originCertificate)}
                      />
                      <Typography variant="caption">Cosign Koi Image</Typography>
                    </Box>
                  )}
                  {consignment.addOn.originCertificate && (
                    <Box>
                      <img
                        src={consignment.addOn.originCertificate}
                        alt="Origin Certificate"
                        className="certificate-image"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                        onClick={() => handleClickImage(consignment.addOn.originCertificate)}
                      />
                      <Typography variant="caption">Origin Certificate</Typography>
                    </Box>
                  )}
                  {consignment.addOn.healthCertificate && (
                    <Box>
                      <img
                        src={consignment.addOn.healthCertificate}
                        alt="Health Certificate"
                        className="certificate-image"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                        onClick={() => handleClickImage(consignment.addOn.healthCertificate)}
                      />
                      <Typography variant="caption">Health Certificate</Typography>
                    </Box>
                  )}
                  {consignment.addOn.ownershipCertificate && (
                    <Box>
                      <img
                        src={consignment.addOn.ownershipCertificate}
                        alt="Ownership Certificate"
                        className="certificate-image"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                        onClick={() => handleClickImage(consignment.addOn.ownershipCertificate)}
                      />
                      <Typography variant="caption">Ownership Certificate</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for full-size image */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="lg">
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Enlarged View"
            style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain' }}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ConsignPage;
