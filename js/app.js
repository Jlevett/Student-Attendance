(function(){
    /*<===Modal==>*/
    let modal = {
        days: 12,
        //classList Contains the students
        classList : [
                        {
                            student: 'Jeff',
                            checked: [],
                        },
                                    {
                            student: 'Lilly the Lizard',
                            checked: [],
                        },
                        {
                            student: 'Bob',
                            checked: [],
                        },
                        {
                            student: 'Smelly Goat',
                            checked: [],
                        },
                        {
                            student: 'Adam',
                            checked: [],
                        }
                    ],

        init : function(){
                //Generate true or false
                function getRandom(){
                    return (Math.random() >= 0.5);
                }
                //If no localstorage for the list is found, create it with random missed days
                if(!localStorage.attendanceList){
                    modal.classList.forEach(function(studentRecord){
                        for(let i =1; i<=modal.days; i++){
                            studentRecord.checked.push(getRandom());
                        }
                    });
                    localStorage.attendanceList = JSON.stringify(modal.classList);
                //Upload the classList to the localStorage
                } else {
                    modal.classList = JSON.parse(localStorage.attendanceList);
                }

        },
    }
    /*<===Octopus==>*/
    let octopus = {

        init: function(){
            //load view
            modal.init();
            view.init();
            view.monitor();

        },
        getDays : function(){
            //return the numberofDays/Columns
            return modal.days;
        },
        getStudentName: function(i){
            //return requested name
            return modal.classList[i].student;
        },

        getNumberStudent: function(){
            //return number of students
            return modal.classList.length;
        },

        calculateMissedDays : function(studentNo){
            //calculate how many missed days there have been
            let sum = 0;
                modal.classList[studentNo].checked.forEach(function(box){
                    if(box === true)
                        ++sum;
                });
            return sum;
        },

        checkedInForDay: function (student, Day) {
            //Confirms if the student made it to class on specified day
            return modal.classList[student].checked[Day];
        },

        updateCheckBox : function(x,y,bol) {
            //Updates modal.
            modal.classList[x].checked[y] = bol;
        },

        localStorageUpdate : function (){
            localStorage.attendanceList = JSON.stringify(modal.classList);
        }

    };
    /*<===View===>*/
    let view = {
        init: function() {
                this.topRowDisplay();
                this.mainDisplay();
             },

        mainDisplay: function() {
                let docFragElement = document.createDocumentFragment();
                this.totalStudents = octopus.getNumberStudent();
                for(let studentNo = 0; studentNo < this.totalStudents; studentNo++) {
                    //ADD <tr class="student">
                    let student = document.createElement('tr');
                    student.className = 'student';
                    //ADD <td class="name-col">Slappy the Frog</td>
                    let nameCol = document.createElement('tr');
                    nameCol.className = 'name-col';
                    //define studentNo;
                    nameCol.innerText = octopus.getStudentName(studentNo);
                    student.appendChild(nameCol);
                   //ADD <td class="attend-col"><input type="checkbox"></td> times number of days
                    for(let i = 0; i <this.days; i++){
                        let checkBox = document.createElement('td');
                        checkBox.className = 'attend-col';

                        if(octopus.checkedInForDay(studentNo, i)){
                            checkBox.innerHTML = '<input type="checkbox" checked>';
                        }  else {
                            checkBox.innerHTML = '<input type="checkbox">';
                        }

                        student.appendChild(checkBox);
                    }

                    //Add <td class="missed-col">0</td>
                    let missedCol = document.createElement('td');
                    missedCol.className = 'missedcol';
                    missedCol.innerText =octopus.calculateMissedDays(studentNo);
                    student.appendChild(missedCol);
                    //append child to the document fragment
                    docFragElement.appendChild(student);
                }
                this.mainElement = document.querySelector('.main');
                this.mainElement.appendChild(docFragElement);
             },

        topRowDisplay: function(){
                this.days = octopus.getDays();
                let docFragElement = document.createDocumentFragment();
                for(let i = 1; i <= this.days; i++){
                    let dayColumn = document.createElement('th');
                    dayColumn.textContent = i;
                    docFragElement.appendChild(dayColumn);
                }
                this.nameColumns = document.querySelector('.name-col');
                let parentColumn = document.querySelector('.parent-col');
                parentColumn.insertBefore(docFragElement, this.nameColumns.nextSibling);
        },
        //Setups event listener for each checkbox and updates the modal via the octopus if there was a change.
        monitor : function(){
                let checkboxes = document.querySelectorAll("input[type=checkbox]");
                checkboxes.forEach(function(checkbox){
                    checkbox.addEventListener( 'click', function(){
                        let days = document.querySelectorAll('.attend-col');
                        let z = 0;
                        for(let x = 0 ; x<(days.length/12); x++){
                            for(let y=0; y<(days.length/octopus.getNumberStudent()); y++){
                                if(checkboxes[z].checked)
                                    octopus.updateCheckBox(x,y,true);
                                else
                                    octopus.updateCheckBox(x,y,false);
                                z++;
                            }
                        }
                        //update localStorage
                        octopus.localStorageUpdate();
                        //update missed days on the view
                        let daysMissed = document.querySelectorAll('.missedcol');
                        for(let i = 0; i < daysMissed.length; i++)
                            daysMissed[i].innerText = octopus.calculateMissedDays(i);
                    });
                });
            },
        };

octopus.init();
}());


