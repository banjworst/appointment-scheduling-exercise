
const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
};
const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];

const http = require ('http');
const url = require('url');

let  myserver = http.createServer(function (req, res) {
let urlObj = url.parse(req.url, true);
console.log(urlObj);

switch (urlObj.pathname){
	case "/schedule":
		schedule(urlObj.query,res);
		break;
	case "/cancel":
		cancel(urlObj.query, res);
		break;
	default:
		error(404, "pathname not found", res);

	}


});

function schedule(queryObj,res) {
	if (availableTimes[queryObj.day].some(element =>  element  == queryObj.time)) {

		availableTimes[queryObj.day] = availableTimes[queryObj.day].filter(element => element !== queryObj.time);

		appointments.push({ name: queryObj.name, day: queryObj.day, time: queryObj.time });

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write("scheduled"); //write (send) a response to the client when an appointment is scheduled
		res.end();
	}
	else
		error(400, "can't schedule", res);
}

function cancel(queryObj, res) {
	let removed = false; 
        for (let i = 0; i < appointments.length; i++) {
                let app = appointments[i];
        
                if (app.name === queryObj.name && app.day === queryObj.day && app.time === queryObj.time) {
                        appointments.splice(i, 1);
                        
                        if (availableTimes[queryObj.day]) {
                                availableTimes[queryObj.day].push(queryObj.time);
                        }
                        removed = true;

                }
        }

        if (removed) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write("Appiointment has been canceled"); //write (send) a response to the client
                res.end();
        } else {
                error(404, "Appointment not found", res);
	}
}

function check(queryObj, res) {
	if (!queryObj.day || !queryObj.time) {
		error(400, "Missing day or time in request", res);
		return;
	}

	if (availableTimes[queryObj.day] && availableTimes[queryObj.day].includes(queryObj.time)) {
		sendResponse(200, "Time is available", res);
	} else {
		sendResponse(200, "Time is NOT AVAILABLE", res);
	}
}

function error(status, message, res) {
	res.writeHead(status, { "Content-Type": "text/plain" });
	res.write("Error: " + message);
	res.end();
	
	}


}


myserver.listen(80, function(){console.log("listening on port 80")});
