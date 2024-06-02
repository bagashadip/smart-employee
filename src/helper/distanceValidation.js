const distanceValidation = (data) => {
    console.log(data);
    const toRad = (value) => {
        return (value * Math.PI) / 180;
    };
    
    var latAbs = data.latAbs;
    var lonAbs = data.lonAbs;
    var latUk = data.latUk;
    var lonUk = data.lonUk;
    var rad = data.rad;
    var status = null;
    
    var R = 6371;
    var dLat = toRad(latUk - latAbs);
    var dLon = toRad(lonUk - lonAbs);
    var lat1 = toRad(latAbs);
    var lat2 = toRad(latUk);
    
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000; // Conver Km to meter
    //Return value for label WFH/WFO
    if (d > rad) {
        status = "WFH";
    } else {
        status = "WFO";
    }
    
    return {status: status, d: d};
};
  
module.exports = {
    distanceValidation,
};