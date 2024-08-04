'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Button, Modal, Typography, Stack, TextField } from "@mui/material";
import { query, setDoc, collection, getDocs, getDoc, doc, deleteDoc,  } from "firebase/firestore";

export default function Home() {

  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async() =>{
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }


  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      }
      else{
        await setDoc(docRef, {quantity:1})
      }
      await updateInventory()
    }

  

  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }else{
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=>{
    updateInventory()
  }, [])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return( <Box width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    gap={2}>

<Box height="100px" alignItems="center" display="flex" justifyContent="center">
        <Typography variant="h2" color="#333">Pantry Tracker</Typography>

      </Box>
    <Modal open = {open} onClose={handleClose}> 
      <Box position="absolute"
      top="50%"
      left="50%"
      width={400}
      bgcolor="white"
      border="2px solid #0000"
      boxShadow={24}
      padding={4}
      display="flex"
      flexDirection="column"
      gap={3}
      >
      <Typography>Add Item</Typography>
      <Stack width="100%" direction="row" spacing={2} alignItems="center">
        <TextField
        variant='outlined'
        fullWidth
        value={itemName}
        onChange={(e)=>{
          setItemName(e.target.value)}
        }></TextField>
          <Button variant="outlined"
          onClick={()=>{
            addItem(itemName)
            setItemName('')
            handleClose()
          }}
          >Add</Button>
    
      </Stack>
      </Box>
    </Modal>
    <Stack width="40%" direction="row" spacing={2} alignItems="center">
    <Button variant="contained"
    onClick={()=> {
      handleOpen()
    }}>Add New Item</Button>
    <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{mt:4, width: 'calc(100% - 170px)', height:'100%'}}
          /></Stack>
    
    <Box border="1px solid #333" height={600}>
      
    
    <Stack width="800px" height="600px" spacing={2} overflow="auto">
      {
        filteredInventory.map(({name, quantity}) => (
          <Box 
          key={name} 
          width="100%" 
          minHeight="50px" 
          display="flex" 
          alignItems="center" 
          justifyContent="space-between" 
          
          padding={5}>
            
            <Typography height="30px" variant="h5" color ="#333" textAlign="center">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>

            <Typography height="30px" variant="h5" color ="#333" textAlign="center">
              {quantity}
            </Typography>
            
            <Stack direction="row" spacing={2}>
            <Button height="30px" variant="contained" onClick={()=> {
              addItem(name)

            }}>ADD</Button>

            <Button variant="contained" onClick={()=> {
              removeItem(name)

            }}>REMOVE</Button>
            </Stack>


          </Box>
        ))
      }
    </Stack>

    </Box>
    
    </Box>)

  }
