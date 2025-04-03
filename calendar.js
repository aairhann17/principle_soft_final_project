const daysTag = document.querySelector(".days"), //variables
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date();
Year = date.getFullYear(), //variables
Month = date.getMonth();

let appointments = {}; //creating object

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; //array of months

const renderCalendar = () => {
    
    const currentDate = document.querySelector(".current-date");
    const daysTag = document.querySelector(".days");


    let firstDay = new Date(Year, Month, 1).getDay(), //first day of the month
    lastDate = new Date(Year, Month + 1, 0).getDate(), //last date of the month
    lastDay = new Date(Year, Month, lastDate).getDay(), //last day of the month
    lastDatePrev = new Date(Year, Month, 0).getDate(); //last date of previous month
    let liTag = "";

    for (let i = firstDay; i > 0; i--) { //last dates of previous month
        liTag += `<li class="inactive">${lastDatePrev - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDate; i++) { //creating days for current month
        let fullDate = `${Year}-${String(Month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        let hasEvent = appointments[fullDate] ? "event" : "";

        let isToday = i === date.getDate() && Month === new Date().getMonth() && Year === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday} ${hasEvent}" onclick="showMenu(${i})">${i}</li>`; //event class 
    }
    
    for (let i = lastDay; i < 6; i++) { //next month inactive days
        liTag += `<li class="inactive">${i - lastDay + 1}</li>`
    } 
    currentDate.innerText = `${months[Month]} ${Year}`;
    daysTag.innerHTML = liTag;
}
renderCalendar(); //rendering page when loading in


prevNextIcon.forEach(icon => { //next and previous months buttons
    icon.addEventListener("click", () => {
        Month = icon.id === "prev" ? Month - 1 : Month + 1;
        if(Month < 0 || Month > 11) {
            date = new Date(Year, Month, new Date().getDate());
            Year = date.getFullYear();
            Month = date.getMonth();
        } 
        else {
            date = new Date();
        }
        renderCalendar(); //renders next month
    });
});

function showMenu(day) { //creating menu popup
    const menu = document.createElement("div");
    menu.classList.add("popup");
    menu.innerHTML = `<form method="post" action="" id"form" onsubmit="store(event, ${day})">
    <div class="appointment">
    <legend>
    Book an event for ${Year}/${Month + 1}/${day}
    </legend>
    </div>
		<fieldset>
			Name: <input type="text" id="name" name="name" required><br/><br/>
			Email: <input type="email" id="email" name="email" required><br/><br/>
            Time: <input type="time" id="time" name="time" required><br/><br/>
            <p>Method:</p>
            <input type="radio" id="In-Person" name="method" value="In-Person">
            <label for="In-Person">In-Person</label>
            <input type="radio" id="Phone" name="method" value="Phone">
            <label for="Phone">Phone</label><br/><br/>
            <p>Reason:</p>
            <textarea name="reason" form="form"></textarea><br/><br/>
		</fieldset>
        <input type="submit" value="Submit">
	</form>
    <button onclick="closeMenu()">Cancel</button>`;
    
    document.body.appendChild(menu);
    menu.classList.add("show");
}

function confirmation() { //submit button
    const confirm = document.createElement("div");
    confirm.classList.add("popup");
    confirm.innerHTML = `<p>Your event has been booked. Thank you!</p>
        <button onclick="closeMessage()">Close</button>`;
    document.body.appendChild(confirm);
    confirm.classList.add("show");
}

function closeMenu() { //close button
    const menu = document.querySelector(".popup");
    if (menu) {
        menu.classList.remove("show");
        setTimeout(() => {
            menu.remove();
        }, 300);
    }
}

function closeMessage() { //closing confirmation message
    const confirm = document.querySelector(".popup");
    if (confirm) {
        confirm.classList.remove("show");
        setTimeout(() => {
            confirm.remove();
        }, 300);
    }
}

function display() { //display box to the side of calendar
    const savedDataBox = document.getElementById("savedData");

    const name = localStorage.getItem("name") || "Not available";
    const email = localStorage.getItem("email") || "Not available";
    const time = localStorage.getItem("time") || "Not available";
    const method = localStorage.getItem("method") || "Not specified";
    const reason = localStorage.getItem("reason") || "None specified";
    const date = localStorage.getItem("date");

    savedDataBox.innerHTML = `
    <p>Date:</strong> ${date || "Not available"}</p>
        <p>Name:</strong> ${name}</p>
        <p>Email:</strong> ${email}</p>
        <p>Time:</strong> ${time}</p>
        <p>Method:</strong> ${method}</p>
        <p>reason:</strong> ${reason}</p>
    `;
}

function store(event, day) { //storing details in local storage
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var time = document.getElementById("time").value;
    var method = document.querySelector('input[name="method"]:checked')?.value || 'Not specified';
    var reason = document.querySelector("textarea[name='reason']").value;

    let fullDate = `${Year}-${String(Month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    if (!name && !email && !time && !method && !reason) {
        savedDataBox.style.display = "none";
        return;
    }

    localStorage.setItem("date", fullDate);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("time", time);
    localStorage.setItem("method", method);
    localStorage.setItem("reason", reason);


    console.log('Stored data:', { name, email, time, method, reason });

    closeMenu();
    confirmation();
    display();

    fullDate = `${Year}-${String(Month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
appointments[fullDate] = true; // Mark the date as booked
renderCalendar();
}

window.addEventListener("DOMContentLoaded", function() {
    display();
});
