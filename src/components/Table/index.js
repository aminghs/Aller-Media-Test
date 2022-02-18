import { useState, useEffect } from "react";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  color: theme.palette.text.secondary,
  minHeight: "15rem"
}));

const url =
  "https://storage.googleapis.com/aller-structure-task/test_data.json";


const Table = () => {


  const [rows, setRows] = useState([]);

  const [editId, setEditId] = useState();
  const [editText, setEditText] = useState('');

  const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    const rows = await data[0];

    const modifiedData = [...rows];
    for (let singleRow of rows){
      singleRow.id = + new Date() + Math.floor(Math.random()*90000) + 10000;
      if(singleRow?.columns){
        for (let singlePost of singleRow.columns){
          singlePost.id = + new Date() + Math.floor(Math.random()*90000) + 10000;
        } 
      }
    }
    setRows(modifiedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleRemove(columnId) {
    const currentData = [...rows];
    const modifiedData = currentData.map((row) => {
      return {
        ...row,       
        columns: row.columns.filter(column => column.id !== columnId),
      }
    });
    setRows(modifiedData);
    Notify.success(
      'Undo',
      function cb() {
        setRows(currentData);
      },
      {
        timeout: 2000,
        position: 'right-bottom',
      },
    );
  }

  function handleEdit () {
    const listToModify = [...rows];
    for(let singleRow of listToModify){
      if(singleRow.columns ){
        for(let singleColumn of singleRow.columns){
          if(singleColumn.id === editId){
            singleColumn.title = editText;
            break;
          }
        }
      }
    }
    setEditText('');
    setEditId(null);
    setRows(listToModify);
  }

  return (
    <div style={{ margin: "2%" }}>
      {rows.map((row) => <Box key={row.id} sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
              {row.columns.map((column, i) => <Grid item xs={column.width} key={column.id}>
                    <Item>
                          {(editId && editId ===column.id) ? 
                            <input value={editText} onChange={(e) => setEditText(e.target.value)}/> :
                            <h1>
                              {column.title}
                            </h1>
                          }
                          <img src={column.imageUrl + "?height=70&width=100"} alt=""></img>
                          <Button
                            variant="delete"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleRemove(column.id)}
                          >
                            Delete
                          </Button>
                          {(editId && editId === column.id) ? <Button variant="cancel" onClick={() => setEditId(null)}>Cancel</Button> : ''}
                          {(editId && editId === column.id) ? <Button variant="save" onClick={() => handleEdit()}>Save</Button> : ''}
                          {(!editId || editId !== column.id) ? <Button variant="edit"
                            onClick={() => {
                              setEditText(column.title)
                              setEditId(column.id);
                            }}>Edit</Button> : ''}
                    </Item>
                  </Grid>
              )}
            </Grid>
          </Box>
      )}
    </div>
  );
}

export default Table;