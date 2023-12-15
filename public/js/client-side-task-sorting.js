// Foundationally built on Gekks4Geeks article on HTML sorting.
(function () {

    function getTimeVal(timeString) {
        let dateTime = timeString.split(" \n");

        let date = dateTime[0].trim().split("-");
        let time = dateTime[1].trim().split(":");

        let year = Number(date[0]);
        let month = Number(date[1]);
        let day = Number(date[2]);

        let hour = Number(time[0]) % 12;
        let minute = Number(time[1].split(" ")[0]);
        let AMPM = time[1].split(" ")[1];

        if (AMPM == "PM")
            hour += 12;

        let value = year * 100000000 + month * 1000000 + day * 10000 + hour * 100 + minute;
        return value;
    }

    // Declaring Variables
    var form, i, run, li, stop;

    // Taking content of list as input
    form = document.getElementById("sort-form");
    list = document.getElementById("list");

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let option = document.getElementById("sort-option").value;

        if (option == "name") {
            run = true;
            while (run) {
                run = false;
                li = list.getElementsByTagName("LI");
                let names = document.getElementsByClassName('name');
                // Loop traversing through all the list items
                for (i = 0; i < (li.length - 1); i++) {
                    stop = false;
                    if (names[i].innerHTML.toLowerCase() > names[i + 1].innerHTML.toLowerCase()) {
                        stop = true;
                        break;
                    }
                }
                /* If the current item is smaller than
                the next item then adding it after
                it using insertBefore() method */
                if (stop) {
                    li[i].parentNode.insertBefore(li[i + 1], li[i]);
                    run = true;
                }
            }
        }

        else if (option == "time") {
            run = true;
            while (run) {
                run = false;
                li = list.getElementsByTagName("LI");
                let dates = document.getElementsByClassName("date");
                let times = document.getElementsByClassName("time");
                // Loop traversing through all the list items
                for (i = 0; i < (li.length - 1); i++) {
                    stop = false;
                    let time1 = getTimeVal(dates[i].innerHTML + " " + times[i].innerHTML);
                    let time2 = getTimeVal(dates[i + 1].innerHTML + " " + times[i + 1].innerHTML);
                    if (time1 > time2) {
                        stop = true;
                        break;
                    }
                }
                /* If the current item is smaller than
                the next item then adding it after
                it using insertBefore() method */
                if (stop) {
                    li[i].parentNode.insertBefore(li[i + 1], li[i]);
                    run = true;
                }
            }
        }

        else if (option == "contributors") {
            run = true;
            while (run) {
                run = false;
                li = list.getElementsByTagName("LI");
                let contributors = document.getElementsByClassName("contributors");
                // Loop traversing through all the list items
                for (i = 0; i < (li.length - 1); i++) {
                    stop = false;
                    if (Number(contributors[i].innerHTML) > Number(contributors[i + 1].innerHTML)) {
                        stop = true;
                        break;
                    }
                }
                /* If the current item is smaller than
                the next item then adding it after
                it using insertBefore() method */
                if (stop) {
                    li[i].parentNode.insertBefore(li[i + 1], li[i]);
                    run = true;
                }
            }
        }
    }
)})();
