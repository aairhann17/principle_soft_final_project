const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
Year = date.getFullYear(),
Month = date.getMonth();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const renderCalendar = () => {
    let firstDay = new Date(Year, Month, 1).getDay(),
    lastDate = new Date(Year, Month + 1, 0).getDate(),
    lastDay = new Date(Year, Month, lastDate).getDay(),
    lastDatePrev = new Date(Year, Month, 0).getDate();
    let liTag = "";
    for (let i = firstDay; i > 0; i--) {
        liTag += `<li class="inactive">${lastDatePrev - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDate; i++) {
        
        let isToday = i === date.getDate() && Month === new Date().getMonth() 
            && Year === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}" onclick="showMenu(${i})">${i}</li>`;
    }
    for (let i = lastDay; i < 6; i++) { 
        liTag += `<li class="inactive">${i - lastDay + 1}</li>`
    }
    currentDate.innerText = `${months[Month]} ${Year}`;
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => {
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
        renderCalendar();
    });
});

function showMenu(day) {
    const menu = document.createElement("div");
    menu.classList.add("popup");
    menu.innerHTML = `<form method="post" action="" id"form" onsubmit="store(event)">
    <div class="appointment">
    <legend>
    Book an appointment for ${Year}/${Month + 1}/${day}
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

function confirmation() {
    const confirm = document.createElement("div");
    confirm.classList.add("popup");
    confirm.innerHTML = `<p>Your appointment has been booked. Thank you!</p>
        <button onclick="closeMessage()">Close</button>`;
    document.body.appendChild(confirm);
    confirm.classList.add("show");
}

function closeMenu() {
    const menu = document.querySelector(".popup");
    if (menu) {
        menu.classList.remove("show");
        setTimeout(() => {
            menu.remove();
        }, 300);
    }
}

function closeMessage() {
    const confirm = document.querySelector(".popup");
    if (confirm) {
        confirm.classList.remove("show");
        setTimeout(() => {
            confirm.remove();
        }, 300);
    }
}

function display() {
    const savedDataBox = document.getElementById("savedData");

    const name = localStorage.getItem("name") || "Not available";
    const email = localStorage.getItem("email") || "Not available";
    const time = localStorage.getItem("time") || "Not available";
    const method = localStorage.getItem("method") || "Not specified";
    const reason = localStorage.getItem("reason") || "None specified";

    savedDataBox.innerHTML = `
        <p>Name:</strong> ${name}</p>
        <p>Email:</strong> ${email}</p>
        <p>Time:</strong> ${time}</p>
        <p>Method:</strong> ${method}</p>
        <p>reason:</strong> ${reason}</p>
    `;
}

function store(event) {
    event.preventDefault();

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var time = document.getElementById("time").value;
    var method = document.querySelector('input[name="method"]:checked')?.value || 'Not specified';
    var reason = document.querySelector("textarea[name='reason']").value;

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("time", time);
    localStorage.setItem("method", method);
    localStorage.setItem("reason", reason);


    console.log('Stored data:', { name, email, time, method, reason });

    closeMenu();
    confirmation();
    display();
}

window.addEventListener("DOMContentLoaded", function() {
    display();
});
