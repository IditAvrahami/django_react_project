
import './UserList.css'
import DatePicker from "react-datepicker";

import React, { useState, useRef} from "react";
import * as Yup from "yup";
import * as moment from 'moment';
import { Formik , Field} from "formik";
import {Autocomplete} from '../registration/suggestOptions/SuggestionCities'
import axios from 'axios'

const UserList = () => {
    const [user, setUsers] = useState([]);
    const downlodRef = useRef(null);
    React.useEffect(() => {
        getUsers()
    }, [])

     /**
     * Get users record
     */
    const getUsers = async () => {
        const response = await axios.get('http://localhost:8000/users/list/');
        const users = response.data.map((item) => {
            return {
                ...item.fields,
                id: item.pk
        }});
        setUsers(users)
    };
    

    /**
     * Export users list to CSV file
     */
    const exportTable = async() => { 
        const query = {
            startDateOfBirth : selectedStartDateOfBirth ? moment(selectedStartDateOfBirth).format('YYYY-MM-DD') : '',
            endDateOfBirth : selectedEndDateOfBirth ? moment(selectedEndDateOfBirth).format('YYYY-MM-DD') : '' ,
            city : city || null
        }; 

        const queryUrl = new URLSearchParams(query).toString();
        axios.get(`http://localhost:8000/users/export/?${queryUrl}`).then(response => {
            let blob = new Blob([response.data], {type: 'application/octet-stream'})
            let ref = downlodRef
            ref.current.href = URL.createObjectURL(blob)
            ref.current.download = 'users.csv'
            ref.current.click()
        })
    }

    /**
     * User table header
     */
    const renderHeader = () => {
        let headerElement = ['id', 'First Name', 'Last Name', 'Address', 'City', 'Phone', 'ZipCode', 'Date Of Birth', 'has Covid', 'Previous Conditions']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    /**
     * User table body
     */
    const renderBody = () => {
        return user && user.map(({ id, firstName, lastName, address, city, cellularPhone, zipCode, dateOfBirth, hasCovid, previousConditions }) => {
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{address}</td>
                    <td>{city}</td>
                    <td>{cellularPhone}</td>
                    <td>{zipCode}</td>
                    <td>{dateOfBirth}</td>
                    <td>{hasCovid ? 'False' : 'True'}</td>
                    <td>{previousConditions}</td>
                </tr>
            )
        })
    }

    const schema = Yup.object().shape({
        startDate: Yup.date(),
        endDate: Yup.date(),
        city: Yup.string(),
    });

    const [city, setCity] = useState(null);
    const [selectedStartDateOfBirth, setSelectedStartDateOfBirth] = useState(null);
    const [selectedEndDateOfBirth, setSelectedEndDateOfBirth] = useState(null);

    const initUserData = async () => {
        const query = {
            startDateOfBirth : selectedStartDateOfBirth ? moment(selectedStartDateOfBirth).format('YYYY-MM-DD') : '',
            endDateOfBirth : selectedEndDateOfBirth ? moment(selectedEndDateOfBirth).format('YYYY-MM-DD') : '' ,
            city : city || null
        }; 
        const queryUrl = new URLSearchParams(query).toString();
        const response = await axios.get(`http://localhost:8000/users/list/?${queryUrl}`);
        let users = response.data.map((item) => {
            return {
                ...item.fields,
                id: item.pk
        }});
        setUsers(users)
    };


    return (
        <>
             <div>
                 <Formik
                    validationSchema={schema}
                    initialValues={{ }}
                    onSubmit={(values) => {
                        initUserData();
                    }}
                >
                    {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    }) => (
                    <div className="search-container">
                        <div className="form">
                        <form noValidate onSubmit={handleSubmit}>
                            <Autocomplete selectOption={setCity}/>
                            <DatePicker  
                                    onChange={date => setSelectedStartDateOfBirth(date)}
                                    placeholderText={'Select Start Date Of Birth'} 
                                    selected={selectedStartDateOfBirth} />

                            <DatePicker  
                                    onChange={date => setSelectedEndDateOfBirth(date)}
                                    placeholderText={'Select End Date Of Birth'} 
                                    selected={selectedEndDateOfBirth} />        

                            <button className="submitButton" type="submit">Search</button>
                        </form>
                        </div>
                    </div>
                    )}
                </Formik>
            </div>
            <table id='user'>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </table>
            <a style={{display: 'none'}} href='empty' ref={downlodRef}>ref</a>
            <button className="button" onClick={exportTable}>Export Table</button>
        </>
    )
}
export default UserList;