function mapValueToRange(value) {
    if (value >= 0 && value <= 12.0) {
      return mapRange(value, 0, 12.0, 0, 50);
    } else if (value >= 12.1 && value <= 35.4) {
      return mapRange(value, 12.1, 35.4, 51, 100);
    } else if (value >= 35.5 && value <= 55.4) {
      return mapRange(value, 35.5, 55.4, 101, 150);
    } else if (value >= 55.5 && value <= 150.4) {
      return mapRange(value, 55.5, 150.4, 151, 200);
    } else if (value >= 150.5 && value <= 250.4) {
      return mapRange(value, 150.5, 250.4, 201, 300);
    } else if (value > 250.4) {
      return mapRange(value, 250.5, Infinity, 301, Infinity);
    }
  }
  
  function mapRange(value, fromMin, fromMax, toMin, toMax) {
    const normalizedValue = (value - fromMin) / (fromMax - fromMin);
    const mappedValue = (normalizedValue * (toMax - toMin)) + toMin;
    return mappedValue;
  }
  
  // Example usage:
  const inputValue = 37.0; //  input value in the new range
  const mappedValue = Math.round(mapValueToRange(inputValue));
  
  console.log(mappedValue); 
  