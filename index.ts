
import inquirer from "inquirer";

interface Student {
    id: number;
    name: string;
    courses: string[];
    balance: number;
}

interface Course {
    name: string;
    fee: number;
}

let students: Student[] = [];

let courses: Course[] = [
    { name: "Mathematics", fee: 500 },
    { name: "History", fee: 400 },
    { name: "English", fee: 300 }
];

let nextStudentId = 10000;
function generateStudentId(): number {
    return nextStudentId++;
}

function addStudent(name: string){
    const studentId = generateStudentId();
    const newStudent: Student = {
        id: studentId,
        name: name,
        courses: [],
        balance: 0
    };
    students.push(newStudent);
    console.log(`Student added: ${name}, ID: ${studentId}`);
}

function enrollStudent(studentId: number, courseName: string){
    const student = students.find(student => student.id === studentId);
    const course = courses.find(course => course.name === courseName);

    if (student && course) {
        student.courses.push(course.name);
        student.balance += course.fee;
        console.log(`${student.name} enrolled in ${course.name} course.`);
        console.log(`Tuition fees paid: $${course.fee}`);
        showStudentStatus(studentId);
    } else {
        console.log("Student or course not found.");
    }
}

function viewBalance(studentId: number) {
    const student = students.find(student => student.id === studentId);
    if (student) {
        console.log(`${student.name}'s balance: $${student.balance}`);
    } else {
        console.log("Student not found.");
    }
}

function payTuition(studentId: number, amount: number): void {
    const student = students.find(student => student.id === studentId);
    if (student) {
        if (amount <= student.balance) {
            student.balance -= amount;
            console.log(`Paid tuition fees: $${amount}`);
            showStudentStatus(studentId);
        } else {
            console.log(`Insufficient balance. Current balance: $${student.balance}`);
        }
    } else {
        console.log("Student not found.");
    }
}

function showStudentStatus(studentId: number): void {
    const student = students.find(student => student.id === studentId);
    if (student) {
        console.log(`Student ID: ${student.id}`);
        console.log(`Name: ${student.name}`);
        console.log(`Courses Enrolled: ${student.courses.join(', ')}`);
        console.log(`Balance: $${student.balance}`);
    } else {
        console.log("Student not found.");
    }
}

async function main(): Promise<void> {
    while (true) {
        const options = await inquirer.prompt({
            message: "What do you want to do?",
            name: "option",
            type: "list",
            choices: ["Add Student", "Enroll Student", "View Balance", "Pay Tuition Fees", "Show Student Status", "Exit"]
        });

        switch (options.option) {
            case "Add Student":
                const newStudent = await inquirer.prompt({
                    message: "Enter student name:",
                    name: "name",
                    type: "input"
                });
                addStudent(newStudent.name);
                break;

            case "Enroll Student":
                const enrollment = await inquirer.prompt([
                    {
                        message: "Enter student ID:",
                        name: "studentId",
                        type: "number"
                    },
                    {
                        message: "Enter course name:",
                        name: "courseName",
                        type: "list",
                        choices: courses.map(course => course.name)
                    }
                ]);
                enrollStudent(enrollment.studentId, enrollment.courseName);
                break;

            case "View Balance":
                const viewBalanceInput = await inquirer.prompt({
                    message: "Enter student ID:",
                    name: "studentId",
                    type: "number"
                });
                viewBalance(viewBalanceInput.studentId);
                break;

            case "Pay Tuition Fees":
                const payTuitionInput = await inquirer.prompt([
                    {
                        message: "Enter student ID:",
                        name: "studentId",
                        type: "number"
                    },
                    {
                        message: "Enter amount to pay:",
                        name: "amount",
                        type: "number"
                    }
                ]);
                payTuition(payTuitionInput.studentId, payTuitionInput.amount);
                break;

            case "Show Student Status":
                const showStatusInput = await inquirer.prompt({
                    message: "Enter student ID:",
                    name: "studentId",
                    type: "number"
                });
                showStudentStatus(showStatusInput.studentId);
                break;

            case "Exit":
                console.log("Exiting the program.");
                return;

            default:
                console.log("Invalid option.");
                break;
        }
    }
}

// Start the program
main().catch(error => console.error("An error occurred:", error));
