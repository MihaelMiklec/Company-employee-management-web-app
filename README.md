**This project is a result of seven man team effort.**

# Work hours and activities management web app

This web app is a tool similar to Jira that allows a company to track the completion of certain tasks and goals, availability of employees and realized work hours of every employee, work group and company.

The system has 4 types of users: admin (owner of the system/company), group leads, employee and unregistered users.
There is only one admin (owner of the company), he defines the services the company will offer and assigns them to group leads. Group leads further develop a work plan and assign every task within that work plan to employees in their group.
At the beginning of the process, the number of needed work hours is estimated for each employee individually. Furthermore, the price of a work hour is established for every service and/or task.

One employee can work on multiple different tasks within a service, or even on multiple services.

At the end of every work day, every employee (including the group leads) must enter the number of hours worked for that day into the system.

Owner of the company (admin) registers new users (employees, group leads). They fill out a form with all the needed data and assign the newly registered user a role in the system.

Every employee can checkout what tasks they were given, and what groups they are in. Owner of the company can check out the availability and realization of every employee, and the relationship between planned and realised costs/profits.
Group leads can check out the data for themselves and other employees in their group, while regular employees can check it only for themselves.


**Backend (radno-vrijeme) was done with Spring Boot while frontend (frontend) was done with React.js.**


