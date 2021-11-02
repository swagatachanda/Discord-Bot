require("dotenv/config");
const fetch = require("node-fetch");
exports.validURI = async (param) => {
    var data = {}
    var res_json
    try{
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${param}?api_key=${process.env.API_KEY}`
        );
        res_json = await response.json();
    }
    catch(err){
        console.log(err)
        data.error = "Could not fetch data. Please try after sometime."
        return data 
    }
    var title = [];
    if(res_json.dates){
        data.max = res_json.dates.maximum
        data.min = res_json.dates.minimum
    }
    res_json.results.map((item) => {
        var details = {}
        details.titlename = item.title
        details.releasedate = item.release_date
        details.id = item.id
        title.push(details)
    });
    data.name = title
    return data;
};

exports.randommovie = async()=>{
    data = {}
    var json_res
    try{
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/latest?api_key=${process.env.API_KEY}`
        )
        json_res = await res.json()
    } 
    catch(err){
        data.error = "Could not fetch data. Please try after sometime."
        return data 
    }
    const num = Math.floor(Math.random() * (Math.floor(json_res.id) - Math.ceil(0)) + Math.ceil(0))
    console.log(num)
    var data_res
    try{
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${num}?api_key=${process.env.API_KEY}`
        )
        data_res = await res.json()
    } 
    catch(err){
        data.error = "Could not fetch required data. Please try after sometime"
        return data 
    }
    const link = `https://image.tmdb.org/t/p/w500${data_res.poster_path}`
    var genre = []
    if(data_res.success===false){
        data.name = data_res.status_message
        data.poster = ""
        data.plot = ""
        data.lang = "null"
        data.budget = ""
        data.genres = "null"
        data.runtime = ""
        data.date = "null"
    }
    else if(data_res.success===undefined){
        if(data_res.genres.length===0){
            data.name = data_res.original_title
            data.poster = link
            data.plot = data_res.overview
            data.lang = data_res.original_language
            data.budget = data_res.budget
            data.genres = "null"
            data.runtime = data_res.runtime
            data.date = data_res.release_date
        }
        else{
            data_res.genres.map((item)=>{
                genre.push(item.name)
            })
            data.name = data_res.original_title
            data.poster = link
            data.plot = data_res.overview
            data.lang = data_res.original_language
            data.budget = data_res.budget
            data.genres = genre
            data.runtime = data_res.runtime
            data.date = data_res.release_date
        }
        if(data.date===''){
            data.date = 'null'
        }
    }
    return data
}
