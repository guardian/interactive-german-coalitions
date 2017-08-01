import mainTemplate from './src/templates/main.html!text'
import rp from "request-promise"
import mustache from 'mustache'
import config from '../config.json'
import fs from 'fs'

function sortCoalitions(data) {
    data.coalitions.forEach(function(c){
    c.parties = c.parties.split(",");
    c.partylist = [];
    c.parties.forEach(function(p){
        var partydata = data.output.find(function(r){
            return r.party == p;
        })
 //       console.log(partydata);
        var partyobject = {
            "name": p,
            "seatshare" : partydata.seat_share
        };
        c.partylist.push(partyobject);
    })
    });
 //   console.log(data.coalitions[0])
}

export async function render() {
    let data = JSON.parse(await rp(config.docDataJson)).sheets;
    var coalitions = sortCoalitions(data);
    var html = mustache.render(mainTemplate,data);
   fs.writeFileSync('./.build/embed2.html',html)
    return html;
}
