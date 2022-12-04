import React, {useEffect, useState, useRef} from 'react';
import { AgGridReact} from'ag-grid-react';
import'ag-grid-community/dist/styles/ag-grid.css';
import'ag-grid-community/dist/styles/ag-theme-material.css';
import dayjs from 'dayjs';
import Button from'@mui/material/Button';
import Addtraining from './Addtraining';
import JqxScheduler, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxscheduler';

function Traininglist(){

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

    const saveTraining = (training) =>{
        fetch('https://customerrest.herokuapp.com/api/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(training)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };

    const deleteTraining = (link) => {
        if (window.confirm("Are you sure?")){
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.log(err))
        }
    }


    const columns = [
        {field: "activity"},
        {field: "duration"},
        {
            headerName: "Date",
            field: "date",
            cellRenderer: function(field){
                let date = dayjs(field.value).format('DD.MM.YYYY HH.mm');
                if (field.value != null){
                    return date
                } 
            },

        },     
        {
            headerName: "",
            field: "links",
            cellRenderer: function(field){
                if (field.value != null){
                    return <Button color="warning" onClick={() => deleteTraining(field.value[0].href)} >delete</Button>
                }     
            },

        }

    ]

    const source = {
        dataType: "array",
        dataFields: [
          { name: 'activity', type: 'string' },
          { name: 'date', type: 'date' },
        ],
        localData: trainings
    };
    
    const a = {
        date: new jqx.date(new Date()),
        source: new jqx.dataAdapter(source),
        resources: {
          colorScheme: "scheme05",
          dataField: "calendar",
          source: new jqx.dataAdapter(source)
        },
        appointmentDataFields: {
          from: "date",
          to: "date",
          subject: "activity",
          resourceId: "calendar"
        },
        views: [
          'dayView',
          'weekView',
          'monthView'
        ]
    }
  

    return (
    <div className="ag-theme-material"
        style={{height: '400px', width: '100%'}} >
        <h2>{customer.firstname + " " + customer.lastname}</h2>
        <Addtraining saveTraining={saveTraining} customer={customer}/>
        
        <AgGridReact rowData={trainings} columnDefs={columns}></AgGridReact>

        <JqxScheduler
                width={document.body.offsetWidth}
                date={a.date}
                source={a.source}
                showLegend={true}
                view={"weekView"}
                appointmentDataFields={a.appointmentDataFields}
                resources={a.resources}
                views={a.views}
            />

    </div>
    );

}
export default Traininglist;