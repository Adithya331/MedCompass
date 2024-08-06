import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {Routes, Route} from 'react-router-dom'
import axios from 'axios'
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Grid from '@mui/joy/Grid';
import Divider from '@mui/joy/Divider';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import './App.css'
import logo from './assets/logo.svg'
import Hospital from './components/Hospital';

function App() {
  const [latLng, setLatLng ] = useState({})
  const [hospitals, setHospitals] = useState([])
  const navigate = useNavigate()

   useEffect(()=>{
        if('geolocation' in navigator){
          navigator.geolocation.getCurrentPosition((position)=>{
            const {longitude, latitude} = position.coords
           setLatLng({
            lat: latitude,
            lng: longitude
           })
          })
        }
    },[])

  useEffect(()=>{
    if(Object.keys(latLng).length > 0){
        const API = `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${latLng.lng},${latLng.lat},5000&bias=proximity:${latLng.lng},${latLng.lat}&limit=20&apiKey=5be43324ce9245d793bd3804f9272f82`
        axios.get(API).then((response)=>{
          console.log(response.data.features)
          setHospitals(response.data.features)
        })
        console.log("the details are : ", latLng.lat, latLng.lng)
        console.log(hospitals)
    }
    
  },[latLng])

  return(
    
    <div>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar component="nav" sx={{backgroundColor:'white'}}>
        <Toolbar>
        <img src={logo} style={{height:'2rem', marginRight:'1rem'}}></img>
          <Typography
            level="h2"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block', color:'red' } }}
          >
            
            MedCompass
          </Typography>
          
        </Toolbar>
      </AppBar>
    </Box>

    <Routes>
      <Route index element={
      <Grid container spacing={4} sx={{ flexGrow: 1, marginTop:'4rem' }} >
      {
        hospitals.map((hospital,index)=>{
          const {name, state, city, address_line2, datasource} = hospital.properties
          
           if(name) return(
            <Grid lg={6} md={4} sm={4} key={index}>
            <Card size="lg" variant="outlined"
            orientation="horizontal" 
            sx={{
              // width: 590,
              height:200,
              '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
              border:'2px solid lightgray',
              overflow:'hidden'
            }} onClick={()=>{navigate(`/hospital`, {state:hospital})}}
            >
              <CardContent >
                <Typography level='h3' > {name}</Typography>
                <Divider sx={{height:'3px', backgroundColor:'blue'}} />
                <Typography level="title-lg" sx={{marginTop:'2rem'}}>{address_line2}</Typography>
                <Typography level="body-lg">{city}, {state} {datasource.raw.email ? ','+datasource.raw.email : ''} {datasource.raw.website ? ','+datasource.raw.website: ''} </Typography>
              </CardContent>
            </Card>
            </Grid>
          )
        })
      }
      </Grid> }>
      </Route>

      <Route path="/hospital" element={<Hospital latLng={latLng}/>}></Route>
    </Routes>

      
    </div>
  )
}

export default App
