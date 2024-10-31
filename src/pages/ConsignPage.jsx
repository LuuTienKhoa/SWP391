import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { Card, CardContent, Typography } from '@mui/material';

const ConsignPage = ({ token }) => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <>
          {consignment.addOn.originCertificate && <img src={consignment.addOn.originCertificate} alt="Origin Certificate" />}
          {consignment.addOn.healthCertificate && <img src={consignment.addOn.healthCertificate} alt="Health Certificate" />}
          {consignment.addOn.ownershipCertificate && <img src={consignment.addOn.ownershipCertificate} alt="Ownership Certificate" />}
        </>
      )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConsignPage;
