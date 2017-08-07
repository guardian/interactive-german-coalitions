import mainTemplate from './src/templates/main.html!text'
import widgetTemplate from './src/templates/widget.html!text'
import rp from "request-promise"
import mustache from 'mustache'
import config from '../config.json'
import fs from 'fs'

var partialTemplates = {
    "widget" : widgetTemplate
}

function twodecimals(input) {
    return Math.round(input * 100) / 100;
}

function cleannumber(input) {
    if (typeof input == "string") {
        input = input.replace(/,/g, "");
        return parseFloat(input);
    }
    if (typeof input == "number") {
        return input;
    }
}


function calculateSeatShare(partylist) {
    partylist.includedtotal = 0;
    partylist.forEach(function (p) {
        if (p.name != "Others" && cleannumber(p.voteshare) > 5) {
            partylist.includedtotal += cleannumber(p.voteshare);
        };
    })
    partylist.forEach(function (p) {
        if (p.name != "Others" && cleannumber(p.voteshare) > 5)
            p.seatshare = (cleannumber(p.voteshare) / partylist.includedtotal) * 100;
            p.hasSeats = true;
    })
    return partylist;
}

function sortpolls(data) {
    data.forEach(function (poll) {
        var partykeys = Object.keys(poll).filter(function (k) { return k.substring(0, 4) != 'poll' });
        poll.partylist = []
        partykeys.forEach(function (p) {
            var partyobject = {
                "name": p,
                "displayname" : p == 'CDU' ? 'CDU/CSU' : p,
                "voteshare": poll[p]
            }
            poll.partylist.push(partyobject)
        })
        poll.partylist = calculateSeatShare(poll.partylist);
    });
    return data;

}

function sortAllCoalitions(polls, permutations) {
    var newpolls = []
    polls.forEach(function (poll) {
        var newpoll = poll;
        newpoll.newproperty = polls.indexOf(poll);
        newpoll.outcomes = []

        permutations.forEach(function (p) {
            var partyArray = p.parties.split(",");
            var outcome = {
                "heading": p.name,
                "filteredlist" : newpoll.partylist.filter(function(d) {
                    return partyArray.indexOf(d.name) >= 0;
                })
            }
            newpoll.outcomes.push(outcome);
        });
        newpolls.push(newpoll);

    });
    return newpolls;
}

export async function render() {
    let data = JSON.parse(await rp(config.docDataJson)).sheets;
    var polls = sortpolls(data.polls);
    var collatedpolls = sortAllCoalitions(polls, data.coalitions);
    console.log(collatedpolls[0].outcomes[0])
    collatedpolls.forEach(function(p){
        var html = mustache.render(widgetTemplate,p);
        fs.writeFileSync(`./src/assets/embed${p.pollid}.html`, html);
    })
    var html = mustache.render(mainTemplate, collatedpolls[0],partialTemplates);
//    fs.writeFileSync('./src/assets/embed2.html', html);
    fs.writeFileSync('./src/assets/polls.json', JSON.stringify(collatedpolls));
    return html;
}
