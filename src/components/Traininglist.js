import React, {useEffect, useState, useRef} from 'react';
import { AgGridReact} from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import dayjs from 'dayjs';




function Customerlist(){

    const [trainings, setTrainings] = useState([]);
    const [customer, setCustomer] = useState("");

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        const url = window.location.href;
        const urlList = url.split("/");
        fetch('https://customerrest.herokuapp.com/api/customers/'+urlList[4]+'/trainings')
        .then(response => response.json())
        .then(data => setTrainings(data.content))

        fetch('https://customerrest.herokuapp.com/api/customers/'+urlList[4])
        .then(response => response.json())
        .then(data => setCustomer(data))

        
        
    };


    const columns = [
        {field: "activity"},
        {field: "duration"},
        {
            headerName: "Date",
            field: "date",
            cellRenderer: function(field){
                let date = dayjs(field.value).format('DD.MM.YYYY hh:mm');
                return date
            },

        }

    ]


    return (
    <div className="ag-theme-material"
        style={{height: '900px', width: '100%'}} >
        <h2>{customer.firstname + " " + customer.lastname}</h2>
        <AgGridReact rowData={trainings} columnDefs={columns}></AgGridReact>
    </div>
    );

}
export default Customerlist;