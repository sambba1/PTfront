import React, {useEffect, useState, useRef} from 'react';
import { AgGridReact} from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Button from'@mui/material/Button';
import Addcustomer from './Addcustomer';
import Editcustomer from './Editcustomer';


function Customerlist(){

    const [customers, setCustomers] = useState([]);

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://customerrest.herokuapp.com/api/customers')
        .then(response => response.json())
        .then(data => setCustomers(data.content))
        
    };

    const saveCustomer = (customer) =>{
        fetch('https://customerrest.herokuapp.com/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };

    const deleteCustomer = (link, data) => {
        if (window.confirm("Do you want to permanently delete " + data.firstname.toUpperCase() + " "+ data.lastname.toUpperCase() + " from customers?")){
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.log(err))
        }
    }

    const updateCustomer = (customer, link) => {
        fetch(link,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customer)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };


    const columns = [
        {field: "firstname", filter: 'agTextColumnFilter'},
        {field: "lastname", filter: 'agTextColumnFilter'},
        {field: "city", filter: 'agTextColumnFilter'},
        {field: "streetaddress", filter: 'agTextColumnFilter'},
        {field: "postcode", filter: 'agTextColumnFilter'},
        {field: "email", filter: 'agTextColumnFilter'},
        {field: "phone", filter: 'agTextColumnFilter'},
        {
            headerName: "",
            field: "links",
            cellRenderer: function(field){
                const urlList = field.value[2].href.split("/");
                return <Button href={"/trainings/"+urlList[5]}>Trainings</Button>
            },

        },
        {
            headerName: "",
            cellRenderer: function(rowData){
                return <Editcustomer updateCustomer={updateCustomer} customer={rowData.data} />
            },

        },
        {
            headerName: "",
            field: "links",
            cellRenderer: function(field){  
                return <Button color="warning" onClick={() => deleteCustomer(field.value[0].href,field.data)} >delete</Button>
            },

        }
    ]


    return (
    <div className="ag-theme-material"
        style={{height: '900px', width: '100%', margin: 'center'}} >
        <Addcustomer saveCustomer={saveCustomer}/>
        <AgGridReact rowData={customers} columnDefs={columns}></AgGridReact>
    </div>
    );

}
export default Customerlist;