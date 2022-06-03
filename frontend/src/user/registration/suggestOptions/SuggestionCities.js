import React from "react";
import "./SuggestionCities.css";

export const SuggestionsList = props => {
    const {
      suggestions,
      inputValue,
      onSelectSuggestion,
      displaySuggestions,
      selectedSuggestion
    } = props;
  
    if (inputValue && displaySuggestions) {
      if (suggestions.length > 0) {
        return (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => {
              const isSelected = selectedSuggestion === index;
              const classname = `suggestion ${isSelected ? "selected" : ""}`;
              return (
                <li
                  key={index}
                  className={classname}
                  onClick={() => onSelectSuggestion(index)}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        return <div>No suggestions available...</div>;
      }
    }
    return <></>;
  };
  export const Autocomplete = (props) => {

    const {
        selectOption
      } = props;

    const [inputValue, setInputValue] = React.useState("");
    const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
    const [displaySuggestions, setDisplaySuggestions] = React.useState(false);
    
  
    const suggestions = [
        'Abidjan', 'Abu Dhabi', 'Abuja', 'Accra', 'Addis Ababa', 'Ahmedabad', "Tel-Aviv", "Jerusalem",
        'Ahvaz', 'Alexandria', 'Algiers', 'Almaty', 'Ankara', 'Astana', 'Auckland', 'Baghdad', 'Baku', 
        'Bandung', 'Bangkok', 'Barcelona', 'Barranquilla', 'Basra', 'Beijing', 'Belgrade', 'Belo Horizonte',
         'Bengaluru', 'Berlin', 'Bhopal', 'Birmingham', 'Bogotá', 'Brasília', 'Brazzaville', 'Brisbane', 
         'Bucharest', 'Budapest', 'Buenos Aires', 'Bulawayo', 'Busan', 'Cairo', 'Calgary', 'Cali', 
         'Caloocan', 'Campinas', 'Cape Town', 'Caracas', 'Casablanca', 'Changchun', 'Changsha', 'Chaozhou', 
         'Chengdu', 'Chennai', 'Chicago', 'Chittagong', 'Chongqing', 'Cologne', 'Curitiba', 'Córdoba', 'Daegu', 
         'Daejeon', 'Dakar', 'Dalian', 'Dallas', 'Dar es Salaam', 'Davao City', 'Delhi', 'Dhaka', 'Dongguan', 'Douala', 'Dubai', 
        'Durban', 'Ekurhuleni', 'Faisalabad', 'Fez', 'Fortaleza', 'Foshan', 'Fukuoka', 'Fuzhou', 'Giza',
        'Guadalajara', 'Guangzhou', 'Guatemala City', 'Guayaquil', 'Gujranwala', 'Hamburg', 'Hangzhou', 'Hanoi', 'Harare', 'Harbin',
         'Havana', 'Hefei', 'Hiroshima', 'Ho Chi Minh City', 'Hong Kong', 'Houston', 'Hyderabad', 'Hyderabad', 'Ibadan', 'Incheon', 
         'Isfahan', 'Islamabad', 'Istanbul', 'İzmir'
    ];
  
    const onChange = event => {
      const value = event.target.value;
      setInputValue(value);
  
      const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
  
      setFilteredSuggestions(filteredSuggestions);
      setDisplaySuggestions(true);
    };
  
    const onSelectSuggestion = index => {
      setSelectedSuggestion(index);
      setInputValue(filteredSuggestions[index]);
      setFilteredSuggestions([]);
      setDisplaySuggestions(false);
      selectOption(filteredSuggestions[index])
    };
  
    return (
      <>
        <input
          className="user-input"
          type="text"
          placeholder="Select A City"
          onChange={onChange}
          value={inputValue}
        />
        <SuggestionsList
          inputValue={inputValue}
          selectedSuggestion={selectedSuggestion}
          onSelectSuggestion={onSelectSuggestion}
          displaySuggestions={displaySuggestions}
          suggestions={filteredSuggestions}
        />
      </>
    );
  };