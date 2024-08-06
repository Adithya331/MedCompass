import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Divider from '@mui/joy/Divider';
import Stack from '@mui/joy/Stack';
import Link from '@mui/joy/Link';
// import EastIcon from '@mui/icons-material/East';
import axios from 'axios';
import arrow from '../assets/arrow.svg'
  
  export default function Hospital() {
    const location = useLocation();
    const [latLng, setLatLng] = useState({});
    const { name, state, city, datasource, lat, lon } = location.state.properties;
    const [userData, setUserData] = useState({});
    const [directions, setDirections] = useState([])
  
    useEffect(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { longitude, latitude } = position.coords;
          setLatLng({
            lat: latitude,
            lng: longitude,
          });
        });
      }
    }, []);

  
    useEffect(() => {
      if (latLng) {
          const reverseGeocodeApiUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latLng.lat}&lon=${latLng.lng}&format=json&apiKey=5be43324ce9245d793bd3804f9272f82`;
          async function getUserData(){
            const response = await axios.get(reverseGeocodeApiUrl)
            setUserData(response.data.results[0]);
          }
          getUserData()
      }
      console.log(userData)
  }, [latLng]);

  useEffect(() => {
    if (latLng) {
        let routing_api = `https://api.geoapify.com/v1/routing?waypoints=${latLng.lat},${latLng.lng}|${lat},${lon}&mode=drive&lang=en&details=instruction_details&apiKey=5be43324ce9245d793bd3804f9272f82`
        async function getDirections(){
          const response = await axios.get(routing_api)
          const steps = (response.data.features[0].properties.legs[0].steps).map((step) => {
            return step.instruction;
          })
          setDirections(steps)
          console.log(steps)
        }
        getDirections()

    }
  },[latLng])



    return (
      <div style={{ marginTop: '5rem' }}>
        <Grid container spacing={4} sx={{ flexGrow: 1, marginTop: '4rem' }}>
          <Grid item lg={6} md={6} sm={12} key={name}>
            <Card
              size="lg"
              variant="outlined"
              orientation="horizontal"
              sx={{
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                border: '2px solid lightgray',
              }}
            >
              <CardContent sx={{ gap: '1rem' }}>
                <div>
                  <Typography level="h3">{name} <Link level="title-lg" target="_blank" 
  rel="noopener noreferrer" sx={{marginLeft:'1rem', color:'red'}}  href={`https://www.google.com/maps/search/?api=1&query=${location.state.properties.formatted}`}>(View on Maps)</Link></Typography>
                  <Divider sx={{ height: '3px', backgroundColor: 'blue' }} />
                  
                </div>
  
                <Stack direction="column" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Typography level="title-md">User Latitude: {latLng.lat}</Typography>
                  <Typography level="title-md">User Longitude: {latLng.lng}</Typography>
                  <Typography level="title-md">User Formatted Address: {userData.formatted}</Typography>
                  <Divider sx={{ height: '3px', backgroundColor: 'blue' }} />
                </Stack>
  
                <Stack direction="column" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Typography level="title-md">Hospital Latitude: {lat}</Typography>
                  <Typography level="title-md">Hospital Longitude: {lon}</Typography>
                  <Typography level="title-md">Hospital Formatted Address: {location.state.properties.formatted}</Typography>
                  <Divider sx={{ height: '3px', backgroundColor: 'blue' }} />
                </Stack>
  
                <Stack direction="column" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                  <Typography level="title-md">
                    Hospital Website: {datasource.raw.website ? datasource.raw.website : 'N/A'}
                  </Typography>
                  <Typography level="title-md">
                    Hospital Email: {datasource.raw.email ? datasource.raw.email : 'N/A'}
                  </Typography>
                  <Typography level="title-md">State: {state}</Typography>
                  <Typography level="title-md">City: {city}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
  
          <Grid item lg={6} md={4} sm={4}>
          <Card
              size="lg"
              variant="outlined"
              orientation="horizontal"
              sx={{
                '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
                border: '2px solid lightgray',
              }}
            >
              <CardContent sx={{ gap: '1rem' }}>
                <div>
                  <Typography level="h3">Directions</Typography> 
                  <Divider sx={{ height: '3px', backgroundColor: 'blue' }} />
                </div>
  
                <Stack direction="column" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                {
                  directions.map((step)=>{
                    return <div style={{display:'flex', alignItems:'center'}}>
                      <img src={arrow} style={{height:'1rem', marginRight:'1rem'}}></img>
                      <Typography level='title-md'>
                        {step.transition_instruction.replace('.',' and')} {" "+ step.post_transition_instruction}
                      </Typography></div>
                  })
                  
                }
                </Stack>
              </CardContent>
            </Card>
          
              
          </Grid>

        </Grid>
      </div>
    );
  }  

