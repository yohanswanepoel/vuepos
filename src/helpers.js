function formatDateForId(date){
    var year = date.getFullYear();
    var month = "" + (date.getMonth() + 1);
    var day = "" + date.getDate();
    if (month.length < 2){
        month = "0" + month;
    }
    if (day.length < 2){
        day = "0" + day;
    }
    return year + "" + month + "" + day;
}

export {formatDateForId}