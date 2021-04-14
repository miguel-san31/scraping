// Imports

const cheerio = require ('cheerio');
const fs= require ('fs');
const request = require ('request');

// Data

let data = [];

// CODE

request('https://resultados.as.com/resultados/futbol/primera/clasificacion/?omnil=src-sab',(err, res, body)=>{
    let datajson = {};
    if(!err && res.statusCode == 200){
        let $ = cheerio.load(body);
        $('.tit-modulo').each(function(){         
            datajson.titulo = $(this).text();     
        }) 
       let team_cells = $('.nombre-equipo');
       $(team_cells).each(function(index){
            if(index == 20){    
                return false;
              }else{
                let team = { name:'', position: ''};
                let teamName = $(this).text().replace(/\n/g, "");
                let teamPosition = $('.pos').eq(index).text().replace(/\n/g, "");
                teamName = teamName.replace(/\s+/g,' ');
                teamPosition = teamPosition.replace(/\s+/g,' ');
                team.name = teamName;
                team.position = teamPosition;
                data.push(team);
            }
         })
         datajson.equipos = data;
         let json = JSON.stringify(datajson)
         fs.writeFile('datos.json',json, function(err){
            if(err){
                console.log(err);
            }
        })

    } else{
        console.log(res.statusCode);
    }
})