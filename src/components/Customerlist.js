import React, {useEffect, useState, useRef} from 'react';
import { AgGridReact} from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Button from'@mui/material/Button';



function Customerlist(){

    const [customers, setCustomers] = useState([]);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        
    };


    const columns = [
        {field: "firstname", filter: 'agTextColumnFilter'},
        {field: "lastname", filter: 'agTextColumnFilter'},
        {
            headerName: "",
            field: "links",
            cellRenderer: function(field){
                const urlList = field.value[2].href.split("/");
                return <Button href={"/trainings/"+urlList[5]}>Trainings</Button>
            },

        }
    ]


    return (
    <div className="ag-theme-material"
        style={{height: '900px', width: '100%', margin: 'center'}} >

        <AgGridReact rowData={customers} columnDefs={columns}></AgGridReact>
    </div>
    );

}
export default Customerlist;