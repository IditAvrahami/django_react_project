import "./RegisterForm.css";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useRef} from "react";
import { Formik , Field} from "formik";
import * as Yup from "yup";
import * as moment from 'moment';
import axios from 'axios'
import {Autocomplete} from './suggestOptions/SuggestionCities'
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom"
import {
    Link
  } from "react-router-dom";

/**
 * @description - Set Formic controls defenitions, include who is required and what are the errors messages
 */
const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is a required field"),
  lastName: Yup.string().required("Last Name is a required field"),
  address: Yup.string().required("Address is a required field"),
  landLine: Yup.string().required("land Line is a required field"),
  cellularPhone: Yup.number().required("Cellular Phone is a required field"),
  dateOfBirth: Yup.date(),
  zipCode: Yup.number(),
  hasCovid: Yup.boolean()
});

export function RegisterForm() {
    const [selectedDateOfBirth, setSelectedDateOfBirth] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null)
    const [previousConditions, setPreviousConditions] = useState(['diabetes', 'cardio-vascular', 'allergies'])
    const inputRef = useRef(null);
    const navigate = useNavigate();

    /**
     * @description - navigate to 
     */
    const navigateToSummary = () => {
        navigate('/summary')
    }
    /**
     * @description - adding new previous conditions to the current options
     */
    const addNewCondition = event => {
        setPreviousConditions([...previousConditions, inputRef.current.value]);
    };

    /**
     * @description - set city name on uder selection
     * @param {*} val 
     */
    const setCity = (cityName) => {
        setSelectedCity(cityName);
    };

    /**
     * @description - render input element with all behavior 
     * @param {*} handleChange - on value change
     * @param {*} handleBlur  - on input element focus out
     * @param {*} values - form values
     * @param {*} errors  - form error
     * @param {*} touched  - is element touched
     * @param {*} placehoder - element placeholder
     * @param {*} name - unique form control name
     * @param {*} type - input type
     */
    const renderFormInput = (handleChange, handleBlur, values, errors, touched, placehoder, name, type) => {
        return (
            <div>
                <input
                  type={type}
                  name={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values[name] || ''}
                  placeholder={placehoder}
                  className="form-control inp_text"
                  id={name}
                />          
                <p className="error">
                  {errors[name] && touched[name] && errors[name]}
                </p>
            </div>
        )
    }

    /**
     * Generate POST request body with all form fields
     */
    const generatePostBody = (formValues) => {
      return {
        firstName : formValues['firstName'],
        lastName : formValues['lastName'],
        address : formValues['address'],
        landLine : formValues['landLine'],
        cellularPhone : formValues['cellularPhone'],
        dateOfBirth : moment(selectedDateOfBirth).format('YYYY-MM-DD') ,
        zipCode : formValues['zipCode'] || null,
        hasCovid : formValues['hasCovid'] || false,
        city : selectedCity,
        previousConditions: formValues['previousConditions'] && formValues['previousConditions'].length > 0 ? formValues['previousConditions'].join(',') : null
      }
  }

  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={{ }}
        onSubmit={(values) => {
          console.log(generatePostBody(values));

          const data = axios.post(
            'http://localhost:8000/users/insert_user/',
            generatePostBody(values)
          ).then(response =>{
                navigateToSummary();
          })
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
          <div className="login">
            <div className="form">

              <form noValidate onSubmit={handleSubmit}>
                <span>Registration</span>
                {renderFormInput(handleChange, handleBlur, values, errors, touched, "Enter First Name", 'firstName', 'text')}
                {renderFormInput(handleChange, handleBlur, values, errors, touched, "Enter Last Name", 'lastName', 'text')}
                {renderFormInput(handleChange, handleBlur, values, errors, touched, "Enter Address", 'address', 'text')}
              
               <Autocomplete selectOption={setCity}/>
               {renderFormInput(handleChange, handleBlur, values, errors, touched, "Enter Land Line", 'landLine', 'text')}
               {renderFormInput(handleChange, handleBlur, values, errors, touched, "Enter Cellular Phone", 'cellularPhone', 'number')}

                <DatePicker  
                        onChange={date => setSelectedDateOfBirth(date)}
                        placeholderText={'Select Date Of Birth'} 
                        selected={selectedDateOfBirth} />
                <p className="error">
                  {errors.dateOfBirth && touched.dateOfBirth && errors.dateOfBirth}
                </p>

                {renderFormInput(handleChange, handleBlur, values, errors, touched, "Enter ZipCode", 'zipCode', 'number')}
            
                <label htmlFor="hasCovid">Has Covid
                    <input
                  type="checkbox"
                  name="hasCovid"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.hasCovid || ''}
                  placeholder="Enter Zip Code"
                  className="form-control"
                />
                </label>

                <div role="group" className="checkbox-group" aria-labelledby="checkbox-group" >
                 {previousConditions.map(function(condition, i){
                      return (
                        <label key={i} >
                          {condition}
                         <Field type="checkbox" name="previousConditions" value={condition} />
                       </label>
                      ) 
                  })}
                </div>
                <div className="add-condition">
                <input
                    name="other"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={inputRef}
                    placeholder="Other"
                    className="form-control inp_text"
                    id="other"
                  />
                  <button className="submitButton" type="button" onClick={addNewCondition}>+Add</button>
                </div>
                <button className="submitButton" type="submit">Login</button>
              </form>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}

export default RegisterForm;