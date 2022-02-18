import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const url =
  "https://storage.googleapis.com/aller-structure-task/test_data.json";


const Table = () => {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");

  // to keep latest data before delete to be able to restore
  const [dataHistory, setDataHistory] = useState([]);

  const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    const rows = await data[0];

    const modifiedData = [...rows];
    for (let singleRow of rows){
      singleRow.id = + new Date();
      if(singleRow?.columns){
        for (let singlePost of singleRow.columns){
          singlePost.id = + new Date();
        } 
      }
    }
    setRows(modifiedData);
    setDataHistory(modifiedData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleRemove(columnId) {
    const currentData = [...rows];
    setDataHistory(currentData);
    
    const modifiedData = currentData.map((row) => {
      return {
        ...row,       
        columns: row.columns.filter(column => column.id !== columnId),
      }
    });

    setRows(modifiedData);
  }

  function handleEdit (e) {
    setTitle(e.target.value)
  }

  return (
    <div style={{ margin: "2%" }}>
      {rows.map((row) => <Box key={row.id} sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
              {row.columns.map((column, i) => <Grid item xs={column.width} key={column.id}>
                    <h1>
                        {column.title}
                    </h1>
                    <img src={column.imageUrl} alt=""></img>
                    <Button
                      variant="delete"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemove(column.id)}
                    >
                      Delete
                    </Button>
                    <Button variant="edit">Edit</Button>
                    <input
                      type="text"
                      value={title}
                      onChange={() => handleEdit(column.id)}
                    ></input>
                  </Grid>
              )}
            </Grid>
          </Box>
      )}
    </div>
  );
}

export default Table;