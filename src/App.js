import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const url =
  "https://storage.googleapis.com/aller-structure-task/test_data.json";

const extractImageIdFromUrl = function (url) {
    const imageidIndex = url.search(/imageId=[0-9]{8}/);
    const startIndex = imageidIndex + 8;
    const endIndex = imageidIndex + 16;
    return url.slice(startIndex, endIndex);
}

function App() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("");

  const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    const rows = await data[0];
    setRows(rows);
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleRemove(imageId) {
    const newRows = rows.map((row) => {
      return {
       ...row,       
        columns: row.columns.filter(column => extractImageIdFromUrl(column.imageUrl) !== imageId),
      }
    });
    setRows(newRows);
    alert("ok");
  }

  function handleEdit (e) {
    setTitle(e.target.value)
  }

  return (
    <div style={{ margin: "2%" }}>
      {rows.map((row) => {
        return (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              {row.columns.map((column) => {
                return (
                  <Grid item xs={column.width} key={extractImageIdFromUrl(column.imageUrl)}>
                    <h1>
                        {column.title}
                    </h1>
                    <img src={column.imageUrl} alt=""></img>
                    <Button
                      variant="delete"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemove(extractImageIdFromUrl(column.imageUrl))}
                    >
                      Delete
                    </Button>
                    <Button variant="edit">Edit</Button>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleEdit(e.target.value)}
                    ></input>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </div>
  );
}

export default App;